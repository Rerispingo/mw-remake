# MW Remake

## Bibliotecas necessárias:

+ dotenv
+ discord.js
+ nodemon (opcional)

Execute no seu terminal:  
npm install dotenv discord.js nodemon

## Antes de começar:

No início do bot.js, deve hazer duas variáveis: admPath, dotenvPath:

Para o admPath, deve-se mencionar um arquivo que você criará chamado data.json: '{ "adm" : [] }'.  

Para o dotenvPath, deve-se mencionar um arquivo chamado .env com os seguintes dados:

DISCORD_TOKEN= -≥ Token do seu bot. Ex: '878a9sd_ASDA8as7d'  
BOT_CLIENT_ID= -≥ ID do perfil do seu bot no discord. Ex: '18927317293'  
SUDO_USERS= -≥ Lista dos usuários administradores do seu bot. Ex: 123,456

## Funcionalidades:

**Comandos gerais:**

+ **!help** : Exibe todos os comandos.
+ **!roll (Num1) (Num2)** : Retorna um número aleatório entre os dois números informados.
+ **!primes (Num1)** : Retorna todos os números primos de 1 até o número informado.
+ **!primes (Num1) (Num2)** : Retorna todos os números primos entres os dois números informados.

**Comandos de operadores:**

+ **!adm add (mention)** : Adiciona um usuário a lista de operadores.
+ **!adm remove (mention)** : Remove um usuário da lista de operadores
+ **!limit (quant)** : Define um limite para a chamada de voz atual (0 p/ remover)
+ **!kick (user)** : Remove o usuário da chamada que ele está.


# Changelog:

## Versiona 1.0.2:

### Implementações:

+ Comando !limit : Define um limite para a chamada de voz atual (0 p/ remover).
+ Comando !kick : Expulsa um usuário da chamada que ele esta.


### Alterações e Correções:

+ Substituição do commands {} e adm_commands {} por commands.txt.
+ Mudança: .json [ ] -> data.json { }
+ Correção do !adm remove não estar funcionando corretamente.


## Version 1.0.1.1 - Version 1.0.1.2:

+ Correção de pequenos bugs
+ Correção README.MD

## Version 1.0.1:

+ Comandos !primes
+ Comandos !adm

## Version 1.0:

+ Estrutura Basica
+ !help
+ !roll



