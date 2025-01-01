//Código hecho por Eric Muñoz Ledo Popoca
//Taller de Tecnologías Disruptivas
//Importar Módulos Necesarios
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//Configurar Express
const app = express();
const PORT = 3000;

//Middleware para analizar JSON
app.use(bodyParser.json());

//Conectar a MongoDB (Agregado después de bases de datos)
mongoose.connect('mongodb://localhost:27017/clase', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Conectado a MongoDB')).catch(err => console.error(err));

//Modelo de Datos para "Alumno"
const AlumnoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    edad: { type: Number, required: true },
    grado: { type: String, required: true },
    promedio: { type: Number, required: true }
});

const Alumno = mongoose.model('Alumno', AlumnoSchema);

//Crear un Nuevo Alumno
app.post('/alumnos', async (req, res) => {
    try {
        const nuevoAlumno = new Alumno(req.body);
        const alumnoGuardado = await nuevoAlumno.save();
        res.status(201).json(alumnoGuardado);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

//Get para todos los alumnos
app.get('/alumnos', async (req, res) => {
    try {
        const alumnos = await Alumno.find();
        res.status(200).json(alumnos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Get en base al id
app.get('/alumnos/:id', async (req, res) => {
    try {
        const alumno = await Alumno.findById(req.params.id);
        if (!alumno) {
            return res.status(404).json({ error: 'Alumno no encontrado' });
        }
        res.status(200).json(alumno);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Update a un alumno por ID
app.put('/alumnos/:id', async (req, res) => {
    try {
        const alumnoActualizado = await Alumno.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!alumnoActualizado) {
            return res.status(404).json({ error: 'Alumno no encontrado' });
        }
        res.status(200).json(alumnoActualizado);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

//Delete para un alumno
app.delete('/alumnos/:id', async (req, res) => {
    try {
        const alumnoEliminado = await Alumno.findByIdAndDelete(req.params.id);
        if (!alumnoEliminado) {
            return res.status(404).json({ error: 'Alumno no encontrado' });
        }
        res.status(200).json({ message: 'Alumno eliminado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
