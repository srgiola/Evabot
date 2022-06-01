# Evabot | Versión 2.0.0

## Chatbot para la venta de productos al menudeo a travez de Facebook Messager
[Diagrama](https://github.com/srgiola/Evabot/blob/main/Documentaci%C3%B3n/Diagrama%20Fisico%20Evabot.pdf)
- - - -

### Funcionamiento

Evabot esta dividido por en 2 proveedores Cloud, AWS para el despliegue del Core y GCP para el procesamiento del lenguaje y contexto de una conversación. Cuando 
una persona inicia una conversación en Facebook Messager (FB) con nuestro bot, FB envia el payload de la conversación actual hacia nuestro Core el cual lo reenvia hacia GCP 
DialogFlow para que procese y mantenga el contexto de la conversación; a su vez DialogFlow procede a reenviar un payload con una respuesta para el usuario mas un las variables definidas sobre los diferentes contextos
las cuales nosotros tomamos y remplazamos, añadimos o eliminamos del mensaje que generado DialogFlow y los convertimos en diferentes elementos de chat de FB para que el usuario tenga una mejor experiencia.

### Tecnologias
* AWS
  * Lambda
  * DynamoDB
  * Elastic Beanstalk
  * Route53

* GCP
  * DialogFlow
