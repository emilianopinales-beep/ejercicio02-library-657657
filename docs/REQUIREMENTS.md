\# EJERCICIO GUIADO 02

\## Requisitos del sistema de librería en línea



\*\*Alumno:\*\* Emiliano Pascual Pinales Sanchez  

\*\*Matrícula:\*\* 657657  

\*\*Materia:\*\* Integración de Aplicaciones Computacionales  



\---



\# 1. Objetivo



Desarrollar una aplicación web monolítica en Node.js para gestionar una librería en línea mediante acceso directo a PostgreSQL.



La aplicación deberá renderizar HTML del lado del servidor, administrar usuarios registrados, implementar operaciones CRUD sobre el modelo normalizado, manejar imágenes de libros y conservar conceptos y definiciones asociados a cada libro.



La solución utilizará una arquitectura monolítica organizada internamente por módulos y un enfoque MVC para la interfaz.



\---



\# 2. Alcance



El sistema permitirá administrar:



\- Usuarios.

\- Libros.

\- Autores.

\- Géneros.

\- Formatos.

\- Categorías.

\- Conceptos.

\- Definiciones de conceptos por libro.

\- Imágenes de libros.

\- Relaciones entre libros, autores y géneros.

\- Precio y stock de los libros.



La aplicación tendrá tres tipos de actor:



1\. Visitante.

2\. Usuario Registrado.

3\. Administrador.



La aplicación se conectará directamente a PostgreSQL mediante Node.js y consultas SQL parametrizadas.



\---



\# 3. Restricciones arquitectónicas



\- La solución será monolítica.

\- Se utilizará Node.js.

\- Se utilizará Express.

\- Se utilizará EJS para renderizar HTML en el servidor.

\- La aplicación accederá directamente a PostgreSQL.

\- No se desarrollarán APIs REST.

\- No se utilizará GraphQL.

\- No se utilizará SOAP.

\- No se utilizarán microservicios.

\- No se utilizará JSON o XML como formato de intercambio entre frontend y backend.

\- Los formularios HTML enviarán sus datos directamente al monolito.

\- package.json se utilizará únicamente para administrar el proyecto Node.js y sus dependencias.

\- Las operaciones con la base de datos deberán utilizar consultas SQL parametrizadas.



\---



\# 4. Actores



\## 4.1 Visitante



Usuario que todavía no ha iniciado sesión.



Puede:



\- Acceder a la página de inicio.

\- Acceder al formulario de registro.

\- Acceder al formulario de inicio de sesión.



No puede:



\- Consultar información privada del catálogo.

\- Realizar operaciones administrativas.

\- Modificar registros.



\---



\## 4.2 Usuario Registrado



Usuario que tiene una cuenta válida y ha iniciado sesión.



Puede:



\- Consultar el catálogo de libros.

\- Buscar libros por ISBN.

\- Buscar libros por título.

\- Consultar autores.

\- Consultar géneros.

\- Consultar categorías.

\- Consultar formatos.

\- Consultar conceptos y definiciones relacionados con los libros.

\- Consultar imágenes de libros.



No puede:



\- Crear, modificar o eliminar información administrativa.

\- Administrar usuarios.

\- Acceder a funciones exclusivas del Administrador.



\---



\## 4.3 Administrador



Usuario autorizado para administrar el sistema.



Puede:



\- Realizar todas las consultas disponibles para usuarios registrados.

\- Crear libros.

\- Modificar libros.

\- Eliminar libros.

\- Administrar autores.

\- Administrar géneros.

\- Administrar categorías.

\- Administrar formatos.

\- Administrar conceptos.

\- Administrar definiciones de conceptos por libro.

\- Administrar imágenes.

\- Administrar usuarios.

\- Asociar varios autores a un libro.

\- Asociar varios géneros a un libro.

\- Administrar stock y precio.



Debe existir como máximo un usuario Administrador.



\---



\# 5. Requisitos funcionales



\## RF-01 Registro de usuarios



El sistema deberá permitir que un visitante registre una cuenta proporcionando los datos requeridos.



\### Criterios de aceptación



\- Los campos obligatorios deben validarse.

\- El correo o identificador de usuario no podrá duplicarse.

\- La contraseña no deberá almacenarse en texto plano.

\- Una cuenta registrada deberá poder iniciar sesión posteriormente.



\---



\## RF-02 Inicio de sesión



El sistema deberá permitir que un usuario registrado inicie sesión utilizando sus credenciales.



\### Criterios de aceptación



\- Las credenciales válidas permiten iniciar sesión.

\- Las credenciales incorrectas generan un mensaje controlado.

\- El sistema crea una sesión para el usuario autenticado.

\- No se muestran contraseñas ni información sensible.



\---



\## RF-03 Cierre de sesión



El sistema deberá permitir cerrar la sesión actual.



\### Criterios de aceptación



\- La sesión debe invalidarse.

\- Después de cerrar sesión no deberá ser posible acceder a páginas protegidas.



\---



\## RF-04 Consulta del catálogo



Los usuarios autenticados deberán poder consultar los libros disponibles.



\### Criterios de aceptación



Cada libro deberá mostrar al menos:



\- ISBN.

\- Título.

\- Año de publicación.

\- Precio.

\- Stock.

\- Formato.

\- Categoría.

\- Autores.

\- Géneros.

\- Imagen principal cuando exista.



\---



\## RF-05 Búsqueda de libros



El sistema deberá permitir buscar libros por:



\- ISBN.

\- Título.



\### Criterios de aceptación



\- La búsqueda deberá aceptar valores válidos.

\- Los resultados deberán provenir de PostgreSQL.

\- Las consultas deberán ser parametrizadas.



\---



\## RF-06 CRUD de libros



El Administrador deberá poder:



\- Crear libros.

\- Consultar libros.

\- Modificar libros.

\- Eliminar libros.



\### Criterios de aceptación



\- El ISBN deberá ser único.

\- El precio deberá ser válido.

\- El stock no podrá ser negativo.

\- Los errores deberán mostrarse mediante mensajes controlados.



\---



\## RF-07 CRUD de autores



El Administrador deberá poder crear, consultar, modificar y eliminar autores.



Un libro podrá tener varios autores y un autor podrá participar en varios libros.



\---



\## RF-08 CRUD de géneros



El Administrador deberá poder crear, consultar, modificar y eliminar géneros.



Un libro podrá pertenecer a varios géneros y un género podrá estar relacionado con varios libros.



\---



\## RF-09 CRUD de formatos



El Administrador deberá poder crear, consultar, modificar y eliminar formatos.



Los formatos deberán mantenerse como un catálogo independiente.



\---



\## RF-10 CRUD de categorías



El Administrador deberá poder crear, consultar, modificar y eliminar categorías.



Las categorías deberán mantenerse como un catálogo independiente.



\---



\## RF-11 CRUD de conceptos



El Administrador deberá poder crear, consultar, modificar y eliminar conceptos.



Ejemplos de conceptos:



\- IaaS.

\- PaaS.

\- SaaS.

\- FaaS.

\- Public Cloud.

\- Private Cloud.

\- Hybrid Cloud.

\- Multicloud.

\- Serverless.



\---



\## RF-12 Definiciones de conceptos por libro



El sistema deberá permitir asociar conceptos a diferentes libros.



La definición pertenece a la relación entre libro y concepto.



\### Criterios de aceptación



\- Un libro podrá tener muchos conceptos.

\- Un concepto podrá aparecer en muchos libros.

\- El mismo concepto podrá tener una definición diferente en cada libro.



\---



\## RF-13 Gestión de imágenes



El Administrador deberá poder cargar, modificar y eliminar imágenes asociadas a los libros.



\### Formatos permitidos



\- JPG.

\- PNG.

\- WebP.



\### Criterios de aceptación



\- Se deberá validar la extensión.

\- Se deberá validar el tipo MIME.

\- Se deberá validar el tamaño máximo permitido.

\- El nombre del archivo deberá ser controlado por el sistema.

\- La base de datos almacenará los metadatos y la referencia del archivo.

\- Una imagen podrá marcarse como portada.

\- Se deberá permitir texto alternativo.



\---



\## RF-14 Gestión de stock



El Administrador deberá poder modificar el stock disponible de cada libro.



\### Criterios de aceptación



\- El stock nunca podrá ser negativo.

\- Los valores inválidos deberán rechazarse.



\---



\## RF-15 Gestión de precio



El Administrador deberá poder establecer y modificar el precio de un libro.



\### Criterios de aceptación



\- El precio deberá ser mayor o igual a cero.

\- No deberán aceptarse valores inválidos.



\---



\## RF-16 Control de Administrador único



El sistema deberá permitir como máximo un usuario con rol Administrador.



\### Criterios de aceptación



\- La restricción deberá protegerse desde PostgreSQL.

\- Se deberá realizar una prueba intentando crear un segundo Administrador.

\- PostgreSQL deberá rechazar la operación.



\---



\## RF-17 Autorización por rol



El sistema deberá controlar el acceso a las funciones administrativas.



\### Criterios de aceptación



\- Un Visitante no puede acceder a funciones protegidas.

\- Un Usuario Registrado no puede realizar operaciones administrativas.

\- El Administrador sí puede acceder a las funciones administrativas.

\- Los intentos no autorizados deberán producir una respuesta controlada.



\---



\# 6. Requisitos no funcionales



\## RNF-01 Seguridad



La aplicación deberá proteger credenciales, sesiones, consultas SQL y archivos cargados.



\### Criterios de aceptación



\- Contraseñas almacenadas mediante hash.

\- Consultas SQL parametrizadas.

\- Variables de entorno para credenciales.

\- Validación server-side.

\- Autorización por rol.

\- Manejo seguro de sesiones.

\- Mensajes de error sin información interna sensible.



\---



\## RNF-02 Integridad de datos



PostgreSQL deberá utilizar:



\- Primary Keys.

\- Foreign Keys.

\- UNIQUE.

\- CHECK.

\- Índices.

\- Triggers cuando corresponda.

\- Stored Procedures cuando corresponda.



La base de datos deberá proteger reglas críticas incluso si la aplicación falla.



\---



\## RNF-03 Mantenibilidad



El código deberá organizarse por responsabilidades mediante carpetas y módulos.



La solución deberá separar como mínimo:



\- Configuración.

\- Rutas.

\- Servicios o lógica de negocio.

\- Middleware.

\- Vistas.

\- Recursos públicos.

\- Archivos cargados.

\- Base de datos.

\- Documentación.



\---



\## RNF-04 Usabilidad



La interfaz deberá ser clara y permitir identificar fácilmente:



\- Inicio de sesión.

\- Registro.

\- Catálogo.

\- Búsqueda.

\- Formularios.

\- Operaciones CRUD.

\- Mensajes de éxito.

\- Mensajes de error.



\---



\## RNF-05 Rendimiento



Las consultas deberán evitar operaciones innecesarias.



Se utilizarán índices en campos utilizados frecuentemente para búsqueda o relaciones.



\---



\## RNF-06 Disponibilidad



La aplicación deberá poder ejecutarse de manera estable en la instancia de GCP y ser publicada mediante Apache o NGINX como reverse proxy.



\---



\## RNF-07 Trazabilidad de errores



Los errores internos deberán registrarse de forma controlada para facilitar diagnóstico.



El usuario final no deberá recibir:



\- Stack traces.

\- Consultas SQL internas.

\- Credenciales.

\- Rutas privadas del sistema.



\---



\## RNF-08 Escalabilidad y evolución



La arquitectura será monolítica porque satisface el alcance actual con menor complejidad operativa.



La organización interna por módulos deberá facilitar una posible separación futura de componentes si existe una necesidad real.



\---



\# 7. Actores y operaciones permitidas



| Operación | Visitante | Usuario Registrado | Administrador |

|---|---|---|---|

| Registro | Sí | No necesario | No necesario |

| Login | Sí | Sí | Sí |

| Logout | No | Sí | Sí |

| Consultar catálogo | No | Sí | Sí |

| Buscar libros | No | Sí | Sí |

| Consultar conceptos | No | Sí | Sí |

| Crear registros | No | No | Sí |

| Modificar registros | No | No | Sí |

| Eliminar registros | No | No | Sí |

| Gestionar imágenes | No | No | Sí |

| Administrar usuarios | No | No | Sí |



\---



\# 8. Riesgos iniciales



\## R-01 SQL Injection



\*\*Riesgo:\*\* valores proporcionados por usuarios podrían utilizarse para modificar consultas SQL.



\*\*Control:\*\* utilizar consultas SQL parametrizadas mediante pg.



\---



\## R-02 Archivos peligrosos



\*\*Riesgo:\*\* un usuario podría intentar cargar un archivo malicioso.



\*\*Control:\*\* validar extensión, MIME, tamaño y nombre del archivo.



\---



\## R-03 Exposición de credenciales



\*\*Riesgo:\*\* contraseñas o cadenas de conexión podrían publicarse accidentalmente.



\*\*Control:\*\* utilizar variables de entorno y excluir archivos sensibles de la publicación.



\---



\## R-04 Eliminación accidental de información



\*\*Riesgo:\*\* una eliminación podría afectar registros relacionados.



\*\*Control:\*\* definir correctamente Foreign Keys y las acciones ON DELETE y ON UPDATE.



\---



\## R-05 Acceso administrativo no autorizado



\*\*Riesgo:\*\* un Usuario Registrado podría intentar acceder manualmente a una ruta administrativa.



\*\*Control:\*\* middleware de autenticación y autorización por rol.



\---



\## R-06 Datos sensibles en mensajes de error



\*\*Riesgo:\*\* errores internos podrían revelar información de PostgreSQL o del servidor.



\*\*Control:\*\* mensajes controlados para usuario y registro interno separado.



\---



\## R-07 Contraseñas débiles o expuestas



\*\*Riesgo:\*\* una contraseña almacenada en texto plano podría ser obtenida directamente desde la base de datos.



\*\*Control:\*\* utilizar hash seguro de contraseñas.



\---



\# 9. Supuestos



\- PostgreSQL estará disponible en la instancia de GCP.

\- Node.js se ejecutará en la misma solución monolítica.

\- El Administrador tendrá permisos para administrar todos los registros.

\- Los Usuarios Registrados tendrán acceso únicamente a consultas autorizadas.

\- Sólo existirá un Administrador.

\- Los archivos cargados serán imágenes relacionadas con libros.

\- La aplicación será utilizada con fines académicos.



\---



\# 10. Criterio general de aceptación



El ejercicio se considerará funcional cuando:



1\. La base de datos esté normalizada hasta 4FN.

2\. Existan las restricciones e integridad requeridas.

3\. El sistema permita registro, login y logout.

4\. Los usuarios autenticados puedan consultar el catálogo.

5\. El Administrador pueda realizar CRUD completo.

6\. Se puedan asociar múltiples autores y géneros a un libro.

7\. Se puedan registrar conceptos con definiciones diferentes por libro.

8\. Se puedan administrar imágenes.

9\. Las consultas SQL sean parametrizadas.

10\. Los permisos por rol funcionen correctamente.

11\. Se impida tener más de un Administrador.

12\. Node.js renderice HTML del lado del servidor.

13\. La aplicación funcione mediante PostgreSQL directo sin APIs.

14\. La aplicación se publique mediante Apache o NGINX.

15\. Las pruebas y evidencias queden documentadas.

