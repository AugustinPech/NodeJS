# Node JS
|            alias             |                  signification                  | ressources associées                      |
| :--------------------------: | :---------------------------------------------: | ----------------------------------------- |
|             RTA              |             Real Time Applications              |                                           |
|             SPA              |            Single Page Applications             | FrameWorks associés : Angular, Vue, React |
| Multithread // Single thread | capacité à faire plusieurs taches en même temps |                                           |
|   Blocking // Non-Blocking   | un système bloquant exécute les taches les unes après les autres. |                                           |
## What's NodeJS?

NodeJS is a **Non-Blocking** and **Single thread** JS server system. Specialy designed for hosting JS applications. 

A NodeJS server can stack requests in an **Event Queue**

The **Event Loop** create a list a callback requests in the **Thread Pool** and execute threads starting with the first request received (**FIFO** method)

### Good Stuff
### Bad Stuff
## Install Node JS
|                                         ressources                                          |
| :-----------------------------------------------------------------------------------------: |
|           [github](https://github.com/nvm-sh/nvm?tab=readme-ov-file#git-install)            |
|                  [définitions de base ](https://apprendre-a-coder.com/apprendre-node-js/)                   |
| [stucture et fonctionnement](https://www.data-transitionnumerique.com/nodejs-guide-complet/#h-node-js-c-est-quoi) |
|                                                                                             |

`cd ~/`

`git clone https://github.com/nvm-sh/nvm.git`

`cd ~/.nvm`

`git checkout v0.39.7`

`. ./nvm.sh`

`nvm install node`

`nvm install-latest-npm`

`node`

`mv .nvm .nvmrc`