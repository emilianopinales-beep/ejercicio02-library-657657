# Actividad - Microservicio bilingüe XML/JSON

## Descripción

Se modificó el microservicio Flask para que pueda responder en XML y JSON utilizando el parámetro `format`.

Ejemplos:

- `/books` → XML por defecto
- `/books?format=json` → JSON
- `/books/<isbn>?format=json` → libro específico en JSON
- `/concepts/cloud?format=json` → conceptos IaaS, PaaS, SaaS y FaaS con sus libros relacionados
- `/books/minimal?format=json` → datos mínimos de los libros junto con sus imágenes

Si no se especifica el parámetro `format`, el microservicio responde en XML.

## Reflexión

Es importante que un microservicio pueda responder en diferentes formatos porque distintos clientes pueden requerir distintas formas de intercambiar información. XML permite mantener compatibilidad con servicios SOAP y sistemas que utilizan estructuras más formales, mientras que JSON es más ligero y común en aplicaciones web y APIs modernas. Permitir ambos formatos hace que el servicio sea más interoperable y pueda ser consumido por diferentes tecnologías sin duplicar la lógica de negocio.
