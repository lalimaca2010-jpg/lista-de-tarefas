let entrada = document.getElementById("entrada")
let botao = document.getElementById("botao")
let lista = document.getElementById("lista")

botao.addEventListener("click", function() {

    let tarefa = entrada.value

    if (tarefa === "") {
        return
    }

    fetch("/adicionar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            tarefa: tarefa
        })
    })
    .then(response => response.json())
    .then(dados => {

        let novaTarefa = document.createElement("li")

        let texto = document.createElement("span")
        texto.textContent = dados.tarefa

        if (dados.concluida === 1) {
            texto.style.textDecoration = "line-through"
        }

        texto.addEventListener("click", function() {

            fetch(`/concluir/${dados.id}`, {
                method: "PUT"
            })
            .then(response => response.json())
            .then(resultado => {

                if (resultado.concluida === 1) {
                    texto.style.textDecoration = "line-through"
                } else {
                    texto.style.textDecoration = "none"
                }

                dados.concluida = resultado.concluida
            })
        })

        let remover = document.createElement("button")
        remover.textContent = "X"
        remover.className = "botao-remover"

        remover.addEventListener("click", function(event) {

            event.stopPropagation()

            fetch(`/remover/${dados.id}`, {
                method: "DELETE"
            })
            .then(response => response.json())
            .then(() => {
                novaTarefa.remove()
            })
        })

        novaTarefa.appendChild(texto)
        novaTarefa.appendChild(remover)

        lista.appendChild(novaTarefa)

        entrada.value = ""
    })
})

fetch("/tarefas")
.then(response => response.json())
.then(tarefas => {

    tarefas.forEach(function(dados) {

        let novaTarefa = document.createElement("li")

        let texto = document.createElement("span")
        texto.textContent = dados.tarefa

        if (dados.concluida === 1) {
            texto.style.textDecoration = "line-through"
        }

        texto.addEventListener("click", function() {

            fetch(`/concluir/${dados.id}`, {
                method: "PUT"
            })
            .then(response => response.json())
            .then(resultado => {

                if (resultado.concluida === 1) {
                    texto.style.textDecoration = "line-through"
                } else {
                    texto.style.textDecoration = "none"
                }

                dados.concluida = resultado.concluida
            })
        })

        let remover = document.createElement("button")
        remover.textContent = "X"
        remover.className = "botao-remover"

        remover.addEventListener("click", function(event) {

            event.stopPropagation()

            fetch(`/remover/${dados.id}`, {
                method: "DELETE"
            })
            .then(response => response.json())
            .then(() => {
                novaTarefa.remove()
            })
        })

        novaTarefa.appendChild(texto)
        novaTarefa.appendChild(remover)

        lista.appendChild(novaTarefa)
    })
})
