"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc, setDoc,deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebaseConfig";
import { Plus, Check, X, Pencil,Trash2 } from "lucide-react";

interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  progress: number;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "Pendiente",
    progress: 0,
  });
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [tempProjectData, setTempProjectData] = useState<Partial<Project> | null>(null);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  useEffect(() => {
    const fetchProjects = async () => {
      const projectsCollection = collection(db, "projects");
      const projectsSnapshot = await getDocs(projectsCollection);
      const projectsList = projectsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Project[];

      setProjects(projectsList);
    };
    fetchProjects();
  }, []);

  const validateDates = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) {
      setMessage({ text: "La fecha de fin debe ser mayor que la fecha de inicio.", type: "error" });
      setTimeout(() => setMessage(null), 2000);
      return false;
    }
    return true;
  };



  const handleEdit = (project: Project) => {
    setEditingProjectId(project.id);
    setTempProjectData({ ...project });
  };

  const handleCancel = () => {
    setEditingProjectId(null);
    setTempProjectData(null);
  };

  const handleConfirm = async () => {
    if (!editingProjectId || !tempProjectData) return;

    try {
      const projectRef = doc(db, "projects", editingProjectId);
      await updateDoc(projectRef, tempProjectData);
      setProjects((prevProjects) =>
        prevProjects.map((p) => (p.id === editingProjectId ? { ...p, ...tempProjectData } : p))
      );

      setMessage({ text: "Proyecto actualizado con éxito", type: "success" });
    } catch (error) {
      setMessage({ text: "Error al actualizar el proyecto", type: "error" });
    }

    setEditingProjectId(null);
    setTempProjectData(null);
    setTimeout(() => setMessage(null), 2000);
  };

  const handleCreateProject = async () => {
    if (!newProject.name || !newProject.startDate || !newProject.endDate) {
      setMessage({ text: "Nombre y fechas son obligatorios", type: "error" });
      setTimeout(() => setMessage(null), 2000);
      return;
    }
    if (!validateDates(newProject.startDate, newProject.endDate)) return;
    try {
      const projectRef = doc(collection(db, "projects"));
      await setDoc(projectRef, newProject);
      setProjects([...projects, { id: projectRef.id, ...newProject }]);
      setMessage({ text: "Proyecto creado exitosamente", type: "success" });
      setNewProject({ name: "", description: "", startDate: "", endDate: "", status: "Pendiente", progress: 0 });
    } catch (error) {
      setMessage({ text: "Error al crear el proyecto", type: "error" });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "projects", id));
    setProjects(projects.filter(project => project.id !== id));
    setShowDeleteModal(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900">Gestión de Proyectos</h1>
      {message && <div className={`mt-4 p-2 text-white rounded ${message.type === "success" ? "bg-green-600" : "bg-red-600"}`}>{message.text}</div>}
      
      <div className="mt-6 p-4 border rounded-lg bg-gray-50">
        <h2 className="text-xl font-semibold mb-2">Agregar Nuevo Proyecto</h2>
        <input type="text" placeholder="Nombre" value={newProject.name} onChange={(e) => setNewProject({ ...newProject, name: e.target.value })} className="border p-2 rounded w-full mb-2" />
        <textarea placeholder="Descripción" value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} className="border p-2 rounded w-full mb-2"></textarea>
        <input type="date" value={newProject.startDate} onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })} className="border p-2 rounded w-full mb-2" />
        <input type="date" value={newProject.endDate} onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })} className="border p-2 rounded w-full mb-2" />
        <button onClick={handleCreateProject} className="bg-gray-900 text-white px-3 py-1 rounded"><Plus className="inline-block w-4 h-4 mr-1" />Crear Proyecto</button>
      </div>
      
      <table className="w-full mt-4 border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 p-2">Nombre</th>
            <th className="border border-gray-300 p-2">Descripción</th>
            <th className="border border-gray-300 p-2">Fecha Inicio</th>
            <th className="border border-gray-300 p-2">Fecha Fin</th>
            <th className="border border-gray-300 p-2">Progreso</th>
            <th className="border border-gray-300 p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id} className={`text-center ${editingProjectId === project.id ? "border-4 border-red-500" : ""}`}>
              <td className="border border-gray-300 p-2">
                {editingProjectId === project.id ? (
                  <input
                    value={tempProjectData?.name || ""}
                    onChange={(e) => setTempProjectData({ ...tempProjectData!, name: e.target.value })}
                  />
                ) : (
                  project.name
                )}
              </td>
              <td className="border border-gray-300 p-2">                {editingProjectId === project.id ? (
                  <input
                    value={tempProjectData?.description || ""}
                    onChange={(e) => setTempProjectData({ ...tempProjectData!, description: e.target.value })}
                  />
                ) : (
                  project.description
                )}</td>
              <td className="border border-gray-300 p-2">{project.startDate}</td>
              <td className="border border-gray-300 p-2">{project.endDate}</td>
              <td className="bborder border-gray-300 p-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${project.progress}%` }}></div>
                </div>
              </td>
              <td className="border border-gray-300 p-2">
                {editingProjectId === project.id ? (
                  <>
                    <button onClick={handleConfirm} className="bg-green-600 text-white px-3 py-1 rounded mr-2"><Check className="inline-block w-4 h-4 mr-1" />Confirmar</button>
                    <button onClick={handleCancel} className="bg-gray-500 text-white px-3 py-1 rounded"><X className="inline-block w-4 h-4 mr-1" />Cancelar</button>
                  </>
                ) : (
                  <button onClick={() => handleEdit(project)} className="bg-gray-900 text-white px-3 py-1 rounded"><Pencil className="inline-block w-4 h-4 mr-1" />Editar</button>
                )}
                <button onClick={() => setShowDeleteModal(project.id)} className="bg-red-600 text-white px-3 py-1 rounded">
                  <Trash2 className="w-4 h-4 inline-block" /> Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            <p>¿Estás seguro de eliminar este proyecto?</p>
            <div className="mt-4 flex justify-end">
              <button onClick={() => handleDelete(showDeleteModal)} className="bg-red-600 text-white px-3 py-1 rounded mr-2">
                <Check className="w-4 h-4 inline-block" /> Sí
              </button>
              <button onClick={() => setShowDeleteModal(null)} className="bg-gray-500 text-white px-3 py-1 rounded">
                <X className="w-4 h-4 inline-block" /> Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
