"use client";
import { useEffect, useState } from "react";


export default function ProjectManagement() {
    const [loading, setLoading] = useState(true);

  //if (loading) return <p className="text-center text-gray-500">Cargando Proyectos...</p>;
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900">Gestión de Proyectos</h1>

      <div className="mt-6 p-4 border rounded-lg bg-gray-50">
      <h2 className="text-xl font-semibold mb-2">Agregar Nuevo Proyectos</h2>
      <input
          type="text"
          placeholder="nombre Proyecto"         
          className="border p-2 rounded w-full mb-2"
        />
       <textarea
        name="description"
        placeholder="Descripción"
        className="border p-2 rounded w-full mb-2"
      />
      <input
        type="date"
        name="startDate"
        className="border p-2 rounded w-full mb-2"
      />
      <input
        type="date"
        name="endDate"
        className="border p-2 rounded w-full mb-2"
      />
      <select
        name="status"
        className="border p-2 rounded w-full mb-2"
      >
        <option value="pending">Pendiente</option>
        <option value="in-progress">En progreso</option>
        <option value="completed">Completado</option>
      </select>
      <div className="bg-gray-200 rounded mb-3">
        <div
          className="bg-gray-800 text-xs font-medium text-white text-center p-1 leading-none rounded"
          style={{ width: `5%` }}
        >
          5%
        </div>
      </div>
      <input
        type="number"
        name="progress"
        className="border p-2 rounded w-full mb-2"
        min="0"
        max="100"
      />
      <button type="submit" className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700">
        Guardar Proyecto
      </button>
      </div>
      
      <table className="w-full mt-4 border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 p-2">Nombre Proyecto</th>
            <th className="border border-gray-300 p-2">Descripción</th>
            <th className="border border-gray-300 p-2">startDate</th>
            <th className="border border-gray-300 p-2">startDate</th>
            <th className="border border-gray-300 p-2">Estado</th>
            <th className="border border-gray-300 p-2">Acciones</th>
          </tr>
        </thead>
        </table>
      </div>

    );
}
