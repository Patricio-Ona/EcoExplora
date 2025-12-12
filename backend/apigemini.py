import os
import google.generativeai as genai
from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/receta": {"origins": "*"}})

# 🔑 Tu API Key correcta
# ✅ Lee correctamente el API_KEY desde el entorno
API_KEY = os.environ.get("GOOGLE_API_KEY")
genai.configure(api_key=API_KEY) 

# ✅ Modelo disponible en tu cuenta
#model = genai.GenerativeModel("gemini-1.5-pro-latest")
model = genai.GenerativeModel("gemini-1.5-flash-latest")

@app.route('/')
def index():
    return render_template_string('''
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>🍽️ Generador de Recetas Gemini</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f8f0ff; padding: 30px; display: flex; justify-content: center; }
        .contenedor { max-width: 600px; width: 100%; background: white; padding: 25px; border-radius: 8px; box-shadow: 0 5px 10px rgba(0,0,0,0.15); }
        textarea, button { width: 100%; padding: 10px; margin-top: 10px; border-radius: 5px; border: 1px solid #ddd; }
        button { background: #6200ea; color: white; cursor: pointer; border: none; }
        button:hover { background: #3700b3; }
        pre { background: #f3f3f3; padding: 15px; border-radius: 5px; white-space: pre-wrap; margin-top: 10px; }
    </style>
</head>
<body>
    <div class="contenedor">
        <h2>🍽️ Generador de Recetas con Gemini</h2>
        <textarea id="ingredientes" placeholder="Ingredientes separados por coma"></textarea>
        <button onclick="obtenerReceta()">Generar Receta</button>
        <pre id="resultado"></pre>
    </div>

    <script>
        async function obtenerReceta() {
            const ingredientes = document.getElementById("ingredientes").value;
            const resultado = document.getElementById("resultado");

            resultado.textContent = "⏳ Generando receta...";

            try {
                const response = await fetch("/receta", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ingredientes })
                });

                if (!response.ok) throw new Error("Error al obtener la receta");

                const data = await response.json();
                resultado.innerHTML = data.receta;  // Ahora mostramos el HTML correctamente
            } catch (error) {
                resultado.textContent = error.message;
            }
        }
    </script>
</body>
</html>
''')

@app.route('/receta', methods=['POST'])
def generar_receta():
    data = request.get_json()
    ingredientes = data.get("ingredientes", "")

    # Nuevo prompt para generar la receta sin el prefijo 'html'
    prompt = f"""
    Genera una receta completa en español utilizando estos ingredientes: {ingredientes}.
    Incluye nombre del plato, ingredientes exactos, pasos detallados, dame las calorías de la receta, las calorías por porción y asegúrate de devolverla en formato HTML puro. No agregues ningún prefijo o marca de tipo Markdown. Utiliza las siguientes etiquetas:
    - <h2> para el título
    - <ul> y <li> para los ingredientes
    - <p> para los pasos de la receta.
    """

    # Solicitar la receta al modelo
    response = model.generate_content(prompt)

    return jsonify({"receta": response.text})

# Requerido por Render
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 10000))  # Render expone el puerto como variable de entorno
    app.run(host='0.0.0.0', port=port)
