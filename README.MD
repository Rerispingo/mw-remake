# MW Remake

## Bibliotecas necessárias:

+ dotenv
+ discord.js
+ nodemon (opcional)

npm install dotenv discord.js nodemon

## Arquivos necessários não-inclusos:

data.json {}

.env:  
+ DISCORD_TOKEN=  
+ BOT_CLIENT_ID=  
+ SUDO_USERS=

## Funcionalidades:

### Comandos gerais:

+ **/help** : Lista todos os comandos.
+ **/roll** : Sorteia um numero aleatorio.
+ **/op-list** : Lista todos os operadores do bot atuais do servidor.
+ **/msg-private** : Manda uma mensagem anonima no chat.

### Comandos de operadores:

+ **/clear** : Apaga determinada quantidade de mensagens do chat atual.
+ **/limit** : Limita a quantidade de pessoas da chamada atual.
+ **/kick** : Remove um usuario da chamada atual.
+ **/random-chance** : Altera a chance de um usuario receber uma curiosidade do bot.
+ **/seek-add** : Adiciona uma restrição de chat à uma pessoa. Ex: User1 está proibido de dizer arroz.
+ **/seek-remove** : Remove uma restrição de chat de uma pessoa. O parâmetro '.all' removerá todas as restrições do membro. O parâmetro '@all' removerá todas as restrições do servidor.

### Comandos de super operadores (.env SUDO_USERS):

+ **/op-add** : Adiciona um usuario à lista de operadores.
+ **/op-remove** : Remove um usuario da lista de operadores.

# Changelog:

## **Version 1.2.1**:

Restrições de chat podem ser adicionadas para membros. Caso o membro selecionado digite a restrição registrada, sua mensagem será apagada.  

O bot agora respondera mensagens aleatorias com uma curiosidade.

### Comandos gerais:

+ **/msg-private** : Manda uma mensagem anonima no chat.

### Comandos de operadores:

+ **/random-chance** : Altera a chance de um usuario receber uma curiosidade do bot.
+ **/seek-add** : Adiciona uma restrição de chat à uma pessoa. Ex: User1 está proibido de dizer arroz.
+ **/seek-remove** : Remove uma restrição de chat de uma pessoa. O parâmetro '.all' removerá todas as restrições do membro. O parâmetro '@all' removerá todas as restrições do servidor.

## **Version 1.2**:

+ Mudança para SlashCommands (/) da api do Discord. Obs: Alguns comandos foram removidos temporariamente.

### Comandos gerais:

+ **/help** : Lista todos os comandos.
+ **/roll** : Sorteia um numero aleatorio.
+ **/op-list** : Lista todos os operadores do bot atuais do servidor.

### Comandos de operadores:

+ **/clear** : Apaga determinada quantidade de mensagens do chat atual.
+ **/limit** : Limita a quantidade de pessoas da chamada atual.
+ **/kick** : Remove um usuario da chamada atual.

### Comandos de super operadores (.env SUDO_USERS):

+ **/op-add** : Adiciona um usuario à lista de operadores.
+ **/op-remove** : Remove um usuario da lista de operadores.


## **Version 1.1**:

### Implementações:

+ Comando !clear : Apaga as ultimas mensagens do chat.
+ Comando !adm list : Lista todos os operadores (categoria 1 e categoria 2).
+ Comando !rmsg : Muda a chance de o bot te responder com uma mensagem aleatória.
+ Chance do bot responder alguem com uma mensagem aleatória (1 em 100 por padrão).

### Sistema Vai dar namoro:

Sistema para auxílio do evento "Vai dar namoro". Comandos:

**Comandos do "Vai dar Namoro":**

+ **!vn add (@mention) (Gênero) (*Preferências*)** : Adiciona um usuário à lista de participantes.
+ **!vn remove (@mention)** : Remove um usuário da lista de participantes.
+ **!vn removeAll** : Remove todos os participantes.
+ **!vn list** : Lista todos os participantes/gêneros/preferências.
+ **!vn par (@mention)** : Sorteia um par para o usuário.

**Gêneros e preferências:**  
+ homem
+ mulher
+ outro

## **Version 1.0.2**:

### Implementações:

+ Comando !limit : Define um limite para a chamada de voz atual (0 p/ remover).
+ Comando !kick : Expulsa um usuário da chamada que ele esta.


### Alterações e Correções:

+ Substituição do commands {} e adm_commands {} por commands.txt.
+ Mudança: .json [ ] -> data.json { }
+ Correção do !adm remove não estar funcionando corretamente.


## **Version 1.0.1.1 - Version 1.0.1.2**:

+ Correção de pequenos bugs
+ Correção README.MD

## **Version 1.0.1**:

+ Comandos !primes
+ Comandos !adm

## **Version 1.0**:

+ Estrutura Basica
+ !help
+ !roll



