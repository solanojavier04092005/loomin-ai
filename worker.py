import uuid, threading, os, json, time
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import requests
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

jobs = {}

# =============================================
# LLAMADA A DEEPSEEK
# =============================================
def llamar_deepseek(prompt):
    r = requests.post("https://api.deepseek.com/v1/chat/completions",
        headers={"Authorization": f"Bearer {os.getenv('DEEPSEEK_API_KEY')}"},
        json={"model": "deepseek-chat", "messages": [{"role": "system", "content": prompt}],
              "response_format": {"type": "json_object"}, "temperature": 0.7, "max_tokens": 8000})
    contenido = r.json()["choices"][0]["message"]["content"]
    return json.loads(contenido)

# =============================================
# GENERAR IMAGEN CON REPLICATE
# =============================================
def generar_imagen(prompt):
    import replicate
    replicate_client = replicate.Client(api_token=os.getenv("REPLICATE_API_TOKEN"))
    output = replicate_client.run(
        "stability-ai/stable-diffusion-3",
        input={"prompt": f"Educational illustration for Spanish class. Clean, colorful, minimal design. {prompt}",
               "negative_prompt": "text, words, letters, watermark, messy, dark",
               "width": 1024, "height": 768, "num_outputs": 1}
    )
    return output[0] if output else None

# =============================================
# ARMAR PIZARRA
# =============================================
def armar_pizarra(plan):
    diapositivas = []
    diapositivas.append({"tipo": "titulo", "contenido": plan["portada"]})
    diapositivas.append({"tipo": "resumen", "contenido": {"titulo": "Lo que aprenderemos", "puntos": plan["resumen"]["puntos"]}})
    
    palabras = [{"espanol": p["espanol"], "fonetica": p.get("fonetica", ""), "traduccion": p.get("traduccion", ""), "pinyin": p.get("pinyin", "")} for p in plan["vocabulario"]["palabras"]]
    diapositivas.append({"tipo": "vocabulario", "contenido": {"titulo": "Vocabulario clave", "palabras": palabras}})

    for i, tema in enumerate(plan["temas_gramaticales"]):
        diapositivas.append({
            "tipo": "tabla_gramatical" if tema["tipo_visual"] != "mapa_mental" else "mapa_mental",
            "contenido": {
                "titulo": tema["tema"], "tema_numero": i + 1, "total_temas": len(plan["temas_gramaticales"]),
                "explicacion": tema["explicacion"], "ejemplos": tema["ejemplos"],
                "tipo_visual": tema["tipo_visual"], "datos_visual": tema["datos_visual"],
                "errores_comunes": tema["errores_comunes"], "imagen_url": tema.get("imagen_url")
            }
        })
        diapositivas.append({"tipo": "pausa_reflexion", "contenido": {"titulo": "Momento de reflexión", "mensaje": f'¿Dudas sobre "{tema["tema"]}"?', "pregunta": "¿Todo claro?"}})
        
        for j, ej in enumerate(tema["ejercicios"]):
            diapositivas.append({
                "tipo": "ejercicio",
                "contenido": {
                    "titulo": f'Práctica: {tema["tema"]} ({j + 1}/{len(tema["ejercicios"])})',
                    "tipo_ejercicio": ej["tipo"], "instruccion": ej["instruccion"],
                    "preguntas": ej["preguntas"], "ejercicio_numero": j + 1, "total_ejercicios": len(tema["ejercicios"])
                }
            })

    if plan.get("texto", {}).get("contenido"):
        diapositivas.append({
            "tipo": "lectura",
            "contenido": {"titulo": plan["texto"]["titulo"], "texto": plan["texto"]["contenido"],
                          "preguntas": plan["texto"]["preguntas"],
                          "glosario_interactivo": [{"palabra_o_frase": g["palabra"], "traduccion": g["traduccion"],
                                                    "tipo_palabra": g["tipo"], "ejemplo_es": g.get("ejemplo_es", ""),
                                                    "ejemplo_traducido": g.get("ejemplo_traducido", "")} for g in plan["texto"]["glosario"]]}
        })

    diapositivas.append({"tipo": "cierre", "contenido": plan["cierre"]})
    return {"diapositivas": diapositivas}

# =============================================
# PROCESAR JOB
# =============================================
def procesar(job_id, datos):
    try:
        jobs[job_id]["status"] = "procesando"
        
        prompt = f"""Planifica una clase de español nivel {datos.get('nivel', 'A1')} sobre "{datos.get('tema', '')}". 
Idioma: {datos.get('idiomaEstudiante', 'Chino Mandarín')}.
Responde SOLO con JSON. Incluye "imagen_prompt" para cada tema gramatical.
{json.dumps(datos)}"""
        
        plan = llamar_deepseek(prompt)
        
        # Generar imágenes
        for tema in plan.get("temas_gramaticales", []):
            if tema.get("imagen_prompt"):
                tema["imagen_url"] = generar_imagen(tema["imagen_prompt"])
        
        jobs[job_id]["resultado"] = armar_pizarra(plan)
        jobs[job_id]["status"] = "completado"
    except Exception as e:
        jobs[job_id]["status"] = "error"
        jobs[job_id]["error"] = str(e)

# =============================================
# ENDPOINTS
# =============================================
@app.post("/jobs")
async def crear_job(request: Request):
    datos = await request.json()
    job_id = str(uuid.uuid4())
    jobs[job_id] = {"status": "pendiente", "resultado": None, "error": None}
    threading.Thread(target=procesar, args=(job_id, datos), daemon=True).start()
    return {"job_id": job_id}

@app.get("/jobs/{job_id}")
async def estado_job(job_id: str):
    return jobs.get(job_id, {"error": "no encontrado"})