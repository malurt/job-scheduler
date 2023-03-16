<h1 align="center" style = 'display: flex; align-items: end'>
  <img width= 30% src="./public/images/general/cover.gif" alt="Repo Cover - Person running inside of a Clock">
  <p align="center">Job Scheduler</p>
</h1>

<br></br>

O Job Scheduler automatiza a execução de arquivos com base em uma data (para execuções únicas) ou em uma cron expression (para execuções recorrentes)

<br></br>
Que tal [conhecer o projeto](https://github.com/malurt/test_readme#um-pouco-mais-sobre-o-jobscheduler) para, depois, [usufruir](https://github.com/malurt/test_readme#como-usar-o-job-scheduler) dele? Fique a vontade para navegar por entre os tópicos!
<br></br>
<br></br>

> # Como usar o job scheduler?

**_1._** Para usufruir do projeto localmente, em primeiro lugar, é necessário que se tenha à disposição o código. Para isso, pode-se:

- Clonar o projeto

  ```
  git clone https://github.com/malurt/test_readme.git
  ```

- Baixar o [projeto 'zipado'](./public/images/tutorial/tutorial_download-zip.png "Click to see a tutorial image")

<br></br>

**_2._** Após abrir o projeto no seu editor de código, determine no arquivo `.env` as variáveis de ambiente de acordo com descrito na seção ["Variáveis de Ambiente"](https://github.com/malurt/test_readme#vari%C3%A1veis-de-ambiente).

- O banco de dados a ser utilizado deve estar de acordo com a [modelagem](https://dbdocs.io/maluribeiro08/schedule-job?view=relationships "Click to see the database diagram");

- Caso deseje filtrar os arquivos recebidos com os agendamentos, é necessário determinar as extensões válidas na propriedade `validExts` do aquivo `src/util/constants/schedule-job/upload/config/options.ts`

<br></br>

**_3._** Configurado o ambiente, pode-se:

- iniciar a api, para que novos agendamentos sejam recebidos e computados

  ```
   npm run server:dev
  ```

- iniciar o scheduler, para que a busca por agendamentos a serem executados aconteça.
  ```
  npm run scheduler:dev
  ```

<br></br>

**_4._** Por fim, para agendar uma tarefa, basta enviar uma requisição http para a URL determinada no `.env` cujo body contenha: **_a)_** o arquivo a ser executado; **_b)_** um campo `executionRule` com uma string de data ou expressão cron.

- São aceitas datas em formato padrão (yyyy-MM-dd hh:mm) e em formato brasileiro (dd/MM/yyyy hh:mm)

<br></br>

**_5._** A execução das tarefas agendadas acontece automaticamnete. Toda execução é registrada no banco de dados, sendo possível por exemplo, com uma consulta a ele, verificar quais foram interrompidas devido a falhas e quais foram executadas com sucesso.

<br></br>

## Variáveis de Ambiente

Abaixo estão listadas as variáveis de ambiente essenciais ao projeto, bem como algunas sugestões de valores para o bom funcionamento do projeto:

#### SERVER

`NODE_ENV`

`SERVER_PORT`

`SERVER_BASE_URI`

`SERVER_ENABLED` (true)
<br></br>

#### DATABASE

`DB_DIALECT`

`DB_HOST`

`DB_USERNAME`

`DB_PASSWORD`

`DB_PORT`
<br></br>

#### LOGGER

`LOGGER_CONSOLE_LEVEL` (debug)

`LOGGER_DB_ENABLED` (false)
<br></br>

#### CONSUMER

`CONSUMER_ENABLED` (false)
<br></br>

#### SCHEDULER

`SCHEDULER_ENABLED` (true)
<br></br>

#### JOB FILE UPLOAD

`INPUT_NAME`

`FOLDER_NAME`

`FILTER_ENABLED`

`KEEP_ORIGINAL_FILENAME`

<br></br>

---

<br></br>

> # Um pouco mais sobre o JobScheduler

### Como ele funciona mesmo?

Para saber mais sobre o Job Scheduler, leia abaixo a descrição de seu processo de funcionamento. Você também pode acessar uma versão visual de clicando [aqui](./public/images/general/general_planning-diagram.png).

O Job Scheduler, como já explicado, trabalha em duas frentes: o agendamento e a execução de tarefas. 

Os agendamentos acontecem através de uma API. O server http recebe requisições que trazem em si um arquivo (a tarefa a ser executada) e a regra de execução, que pode ser uma data específica ou um intervalo de repetição do tipo [cron](https://raullesteves.medium.com/node-cron-agendando-e-repetindo-tarefas-f260612487b7). O arquivo recebido é tratado (sendo possível nesta etapa, por exemplo, filtrar extensões) e, depois, armazenado localmente. A regra de execução pode ter dois tratamentos: caso seja do tipo cron, é convertida pra uma data que corresponda à próxima execução da série; se for do tipo data, é apenas formatada, caso esteja nos padrões brasileiros.

A execução por sua vez acontece paralelamente. Repetitivamente, busca-se no banco de dados registros de tarefas ainda não finalizadas cuja data de execução esteja próxima. Retornadas as tarefas que correspondem aos critérios, [processos filhos](https://www.freecodecamp.org/news/node-js-child-processes-everything-you-need-to-know-e69498fe970a/) são lançados para que os respectivos arquivos sejam executados separadamente. Ao fim da execução, dados sobre o seu resultado são registrados e as informações da tarefa, como o seus status (finalizada, em andamento, interrompida), são atualizados.

Detalhes do projeto atual que podem ser adaptados:

\- O banco de dados é vistoriado a cada 1 minuto<sup>\*</sup>;

\- Os arquivos enviados são filtrados pela extensão .js;

\- A regra de execução é aceita em formato padrão ou brasileiro;

<sup>\*</sup> Deve-se tomar cuidado ao determinar o intervalo da vistoria para que tarefas não sejam esquecidas ou executadas em duplicidade;


<br></br>

### Em que eu utilizaria?

Você pode utilizar o Job Scheduler para treinar suas habilidades na programação obviamente, mas também para se livrar da exaustão de executar tarefas repetitivas ou da responsabilidade de ter que lembrar de alguma tarefa do futuro sem se perder no prazo.

<br></br>

---

<br></br>

> # Outros detalhes sobre o Job Scheduler

### - Pincipais Recursos & Tecnologias

- NodeJS
- TypeScript
- Express
- Multer
- Knex
- Cron expressions
- Child Process (spawn)
- DbDocs

### - Design Patterns | Princípios | Metodologias

- Clean Architecture
- Keep It Simple, Silly (KISS)
- Single Responsibility Principle (SRP)
- Interface Segregation Principle (ISP)
- Don't Repeat Yourself (DRY)
- Dependency Inversion Principle (DIP)
- Separation of Concerns (SOC)
- You Aren't Gonna Need It (YAGNI)
- Design Patterns:
  - Factory Method
  - Singleton
  - Adapter
  - Dependency Injection

### - Jornada: da ideia à finalização

- #### :clock12: Quanto tempo?

  - 16h pesquisa & planejamento

  - 52h programação

- #### :books: Fontes de pesquisa acessadas

  - **_Child Process_**

    | Tipo  | Link |
    | :---         |     :---      |
    | DOC  | [Node.js v19.6.1](https://nodejs.org/api/child_process.html)|
    | ART  | [Single thread vs child process vs worker threads vs cluster in nodejs](https://alvinlal.netlify.app/blog/single-thread-vs-child-process-vs-worker-threads-vs-cluster-in-nodejs)|
    | VID  | [How to create a child process in nodejs (exec, execFile and spawn)](https://www.youtube.com/watch?v=bbmFvCbVDqo)|
    | ART  | [Node.js Child Processes: Everything you need to know](https://www.freecodecamp.org/news/node-js-child-processes-everything-you-need-to-know-e69498fe970a/)|
 
    <br></br>

  - **_Processos agendados em Node_**

    | Tipo  | Link |
    | :---         |     :---      |
    | ART  |  [Como executar tarefas agendadas com Node Schedule](https://www.luiztools.com.br/post/como-executar-tarefas-agendadas-com-node-schedule/)|
    | ART  |  [Scheduling Jobs with Node.js](https://reflectoring.io/schedule-cron-job-in-node/)|


    <br></br>

  - **_Multer & Uploads_**

    | Tipo  | Link |
    | :---         |     :---      |
    | DOC  |  [Multer](https://github.com/expressjs/multer/blob/master/doc/README-pt-br.md)|
    | VID  |  [Uploading Images with Multer | NodeJS and ExpressJS](https://www.youtube.com/watch?v=wIOpe8S2Mk8)|
    | ART  |  [Multer: Easily upload files with Node.js and Express](https://blog.logrocket.com/multer-nodejs-express-upload-file/)|
    | FÓRUM  |  [Can't get multer filefilter error handling to work ](https://stackoverflow.com/questions/35050071/cant-get-multer-filefilter-error-handling-to-work)|

    <br></br>

  - **_Cron Expression_**

    | Tipo  | Link |
    | :---         |     :---      |
    | DOC  |  [cron-parser](https://www.npmjs.com/package/cron-parser?activeTab=readme)|
    | ART  |  [Javascript Cron: agendando e repetindo tarefas](https://raullesteves.medium.com/node-cron-agendando-e-repetindo-tarefas-f260612487b7)|
    | TOOL  |  [Crontab Guru](https://crontab.guru/)|

    <br></br>

### - Auxílio, contribuições
  
:adult: :handshake: :woman: Devo ao [Lucas Santos](https://github.com/lucassm02), um dev extraordinário, a ideia (e o desafio) do Job Scheduler. É ele também a pessoa que pensou e criou o template com base no qual desenvolvi o projeto em questão. Além disso, foi ele quem me socorreu nos momentos de desespero hahaha. Um **grande** 'muito obrigada', [Santos](https://github.com/lucassm02)!! 	:star2:
