\# EJERCICIO GUIADO 02

\## Registro de decisiones de ingeniería



\*\*Alumno:\*\* Emiliano Pascual Pinales Sanchez  

\*\*Matrícula:\*\* 657657  

\*\*Materia:\*\* Integración de Aplicaciones Computacionales  



\---



\# 1. Propósito



Este documento registra las principales decisiones de ingeniería tomadas durante el desarrollo de la aplicación web de librería.



Para cada decisión se utiliza el siguiente esquema:



\*\*Necesidad o problema → Alternativas consideradas → Decisión tomada → Justificación técnica → Ventajas → Limitaciones o riesgos → Evidencia de validación\*\*



\---



\# 2. Decisión 1: Utilizar una arquitectura monolítica



\## Necesidad o problema



Se necesita desarrollar una aplicación web que gestione usuarios, libros, autores, géneros, conceptos, imágenes y otras entidades relacionadas utilizando una sola aplicación desplegable.



\## Alternativas consideradas



\- Arquitectura monolítica.

\- Microservicios.

\- Servicios independientes.



\## Decisión tomada



Utilizar una arquitectura monolítica organizada internamente por módulos.



\## Justificación técnica



El alcance actual puede resolverse mediante una sola aplicación Node.js conectada directamente a PostgreSQL.



Separar el sistema en servicios independientes aumentaría la complejidad de despliegue, comunicación, seguridad y monitoreo sin que exista una necesidad real para este ejercicio.



\## Ventajas



\- Menor complejidad operativa.

\- Un solo despliegue.

\- Comunicación interna directa.

\- Menor cantidad de componentes.

\- Desarrollo y pruebas más sencillos.

\- Facilita mantener consistencia de las operaciones.



\## Limitaciones o riesgos



\- Los módulos comparten el mismo proceso.

\- Un problema grave puede afectar toda la aplicación.

\- El crecimiento futuro puede requerir separar algunos componentes.



\## Evidencia de validación



La aplicación completa deberá ejecutarse como una sola unidad Node.js y todos sus módulos formarán parte del mismo proyecto.



\---



\# 3. Decisión 2: Acceso directo a PostgreSQL



\## Necesidad o problema



La aplicación necesita almacenar y consultar información persistente de usuarios, libros, autores, géneros, imágenes y conceptos.



\## Alternativas consideradas



\- Acceso directo desde Node.js a PostgreSQL.

\- API REST intermedia.

\- GraphQL.

\- Servicios independientes.



\## Decisión tomada



Utilizar acceso directo desde Node.js a PostgreSQL mediante la librería pg.



\## Justificación técnica



La aplicación es monolítica y no necesita una capa de servicios remotos entre el backend y la base de datos.



El acceso directo reduce componentes adicionales y permite utilizar consultas SQL parametrizadas.



\## Ventajas



\- Menor cantidad de componentes.

\- Acceso directo a las capacidades de PostgreSQL.

\- Permite utilizar restricciones, vistas, triggers y procedimientos almacenados.

\- Facilita consultas SQL parametrizadas.



\## Limitaciones o riesgos



\- El código queda relacionado directamente con PostgreSQL.

\- Una mala consulta puede afectar el rendimiento.

\- Las credenciales deben protegerse correctamente.



\## Evidencia de validación



Todas las operaciones de datos deberán utilizar pg y consultas SQL parametrizadas.



\---



\# 4. Decisión 3: Renderizado HTML del lado del servidor con EJS



\## Necesidad o problema



Los usuarios necesitan interactuar con formularios, catálogos y operaciones CRUD mediante una interfaz web.



\## Alternativas consideradas



\- Renderizado server-side con EJS.

\- Frontend separado consumiendo una API.

\- Aplicación SPA.



\## Decisión tomada



Utilizar EJS para generar HTML del lado del servidor.



\## Justificación técnica



La aplicación será monolítica y no utilizará APIs REST, GraphQL ni JSON/XML para intercambiar información entre frontend y backend.



Los formularios HTML enviarán directamente sus datos al monolito.



\## Ventajas



\- Arquitectura más sencilla.

\- No requiere frontend separado.

\- Los formularios trabajan directamente con las rutas del servidor.

\- Facilita el control de sesiones y permisos.



\## Limitaciones o riesgos



\- Cada navegación puede requerir renderizar nuevamente una página.

\- La interfaz depende del servidor para generar el contenido.



\## Evidencia de validación



Las vistas estarán almacenadas en la carpeta views y serán renderizadas mediante EJS.



\---



\# 5. Decisión 4: Organización interna por módulos



\## Necesidad o problema



Aunque la aplicación sea monolítica, es necesario evitar que toda la lógica se concentre en un solo archivo.



\## Alternativas consideradas



\- Colocar toda la aplicación en app.js.

\- Organizar el proyecto por responsabilidades.



\## Decisión tomada



Separar el código mediante carpetas y módulos.



\## Organización



\- app.js: inicialización de Express y configuración general.

\- config/: configuración y conexión a PostgreSQL.

\- routes/: recepción de solicitudes HTTP.

\- services/: lógica de negocio y operaciones.

\- middleware/: autenticación, autorización y validaciones comunes.

\- views/: plantillas EJS.

\- public/: CSS, JavaScript del cliente e imágenes estáticas.

\- uploads/: imágenes cargadas por usuarios autorizados.

\- db/: scripts SQL.

\- docs/: documentación.

\- test/: pruebas.



\## Justificación técnica



La separación interna permite mantener responsabilidades claras sin convertir el sistema en una arquitectura distribuida.



\## Ventajas



\- Código más organizado.

\- Facilita mantenimiento.

\- Reduce duplicación.

\- Permite localizar errores con mayor facilidad.



\## Limitaciones o riesgos



\- Los módulos continúan compartiendo la misma aplicación y proceso.

\- Una separación incorrecta podría generar dependencias innecesarias.



\## Evidencia de validación



La estructura de carpetas deberá mantenerse durante el desarrollo.



\---



\# 6. Decisión 5: Consultas SQL parametrizadas



\## Necesidad o problema



Los formularios reciben información proporcionada por usuarios que posteriormente será utilizada en consultas SQL.



\## Alternativas consideradas



\- Construir SQL concatenando valores.

\- Utilizar consultas parametrizadas.



\## Decisión tomada



Utilizar consultas parametrizadas con pg.



\## Justificación técnica



La concatenación directa de valores provenientes del usuario aumenta el riesgo de SQL Injection.



\## Ventajas



\- Reduce el riesgo de SQL Injection.

\- Separa los datos de la estructura de la consulta.

\- Facilita validaciones.



\## Limitaciones o riesgos



\- Es necesario utilizar correctamente los parámetros en todas las consultas.

\- Una sola consulta construida mediante concatenación podría introducir una vulnerabilidad.



\## Evidencia de validación



Se realizará una prueba utilizando caracteres especiales para comprobar que la entrada del usuario se interpreta como datos y no como SQL.



\---



\# 7. Decisión 6: Reglas críticas también protegidas en PostgreSQL



\## Necesidad o problema



Algunas reglas del sistema no deben depender únicamente de las validaciones de la interfaz.



\## Decisión tomada



Implementar restricciones de integridad en PostgreSQL mediante:



\- Primary Keys.

\- Foreign Keys.

\- UNIQUE.

\- CHECK.

\- Índices.

\- Triggers cuando corresponda.



\## Justificación técnica



La base de datos debe mantener información válida incluso si una operación se ejecuta fuera de la interfaz web.



\## Casos importantes



\- ISBN único.

\- Stock no negativo.

\- Precio válido.

\- Relaciones válidas mediante Foreign Keys.

\- Máximo un Administrador.



\## Ventajas



\- Mayor integridad.

\- Reglas aplicadas sin importar el origen de la operación.

\- Evita datos inconsistentes.



\## Limitaciones o riesgos



\- Las restricciones deben diseñarse correctamente.

\- Algunas reglas pueden requerir triggers adicionales.



\## Evidencia de validación



Se realizarán pruebas negativas directamente en PostgreSQL y se documentarán los errores generados.



\---



\# 8. Decisión 7: Guardar imágenes en el sistema de archivos



\## Necesidad o problema



Los libros pueden tener varias imágenes y una de ellas podrá marcarse como portada.



\## Alternativas consideradas



\- Guardar el archivo binario completo dentro de PostgreSQL.

\- Guardar la imagen en el sistema de archivos y registrar sus metadatos en PostgreSQL.



\## Decisión tomada



Guardar las imágenes en el sistema de archivos y almacenar en PostgreSQL únicamente metadatos y la referencia correspondiente.



\## Justificación técnica



Permite mantener separados los archivos del modelo relacional y simplifica el acceso desde la aplicación web.



\## Ventajas



\- Base de datos más ligera.

\- Manejo sencillo de archivos estáticos.

\- Facilita mostrar imágenes desde la aplicación.



\## Limitaciones o riesgos



\- Debe existir sincronización entre archivos y registros.

\- Deben protegerse rutas y nombres.

\- Es obligatorio validar extensión, MIME y tamaño.



\## Evidencia de validación



Se probará carga de JPG, PNG y WebP, además de archivos no permitidos.



\---



\# 9. Decisión 8: Contraseñas almacenadas mediante hash



\## Necesidad o problema



Las contraseñas de usuarios representan información sensible.



\## Alternativas consideradas



\- Guardarlas en texto plano.

\- Guardarlas mediante hash.



\## Decisión tomada



Almacenar únicamente hashes seguros de las contraseñas.



\## Justificación técnica



Una contraseña en texto plano podría quedar expuesta si alguien obtiene acceso a la base de datos.



\## Ventajas



\- Reduce el impacto de una exposición de la base de datos.

\- Evita almacenar directamente la contraseña original.



\## Limitaciones o riesgos



\- Es necesario utilizar correctamente el proceso de hash y comparación.

\- No debe registrarse la contraseña en logs.



\## Evidencia de validación



Se comprobará que la tabla de usuarios no contiene contraseñas en texto plano.



\---



\# 10. Decisión 9: Node.js sólo escuchará en localhost



\## Necesidad o problema



La aplicación debe publicarse utilizando Apache o NGINX como reverse proxy.



\## Decisión tomada



Configurar Node.js para escuchar únicamente en:



127.0.0.1:3000



El acceso externo será realizado mediante Apache o NGINX.



\## Justificación técnica



Esto evita exponer directamente el proceso Node.js a Internet y permite utilizar el servidor web como punto de entrada.



\## Ventajas



\- Node.js no queda expuesto directamente.

\- Centraliza el acceso externo.

\- Permite publicar la aplicación bajo la ruta /library.



\## Limitaciones o riesgos



\- La aplicación dependerá de una configuración correcta del reverse proxy.

\- Una falla en Apache o NGINX impedirá el acceso externo.



\## Evidencia de validación



Se comprobará primero:



http://127.0.0.1:3000/library



y posteriormente:



http://IP\_DEL\_SERVIDOR/library



\---



\# 11. Conclusión inicial



Las decisiones tomadas buscan utilizar la arquitectura más sencilla que permita cumplir los requisitos actuales sin perder organización interna, seguridad ni integridad.



El uso de un monolito no significa que todo el código esté mezclado. La aplicación se mantendrá organizada por responsabilidades dentro de una sola unidad desplegable.



Si en el futuro el sistema necesitara escalamiento o evolución independiente de algún componente, se podría analizar su separación utilizando métricas y evidencia técnica.

