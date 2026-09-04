import sqlite3

from flask import Flask, render_template, request, jsonify

app = Flask(__name__)


def conectar_banco():
    banco = sqlite3.connect("tarefas.db")
    banco.row_factory = sqlite3.Row
    return banco


banco = conectar_banco()

banco.execute("""
CREATE TABLE IF NOT EXISTS tarefas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tarefa TEXT NOT NULL,
    concluida INTEGER NOT NULL
)
""")

banco.commit()
banco.close()


@app.route("/")
def inicio():
    return render_template("index.html")


@app.route("/adicionar", methods=["POST"])
def adicionar():
    dados = request.json
    tarefa = dados["tarefa"]

    banco = conectar_banco()

    cursor = banco.execute(
        "INSERT INTO tarefas (tarefa, concluida) VALUES (?, ?)",
        (tarefa, 0)
    )

    banco.commit()

    id_tarefa = cursor.lastrowid

    banco.close()

    return jsonify({
        "id": id_tarefa,
        "tarefa": tarefa,
        "concluida": 0
    })

@app.route("/tarefas", methods=["GET"])
def tarefas():
    banco = conectar_banco()

    tarefas = banco.execute(
        "SELECT * FROM tarefas"
    ).fetchall()

    banco.close()

    return jsonify([dict(tarefa) for tarefa in tarefas])


@app.route("/remover/<int:id>", methods=["DELETE"])
def remover(id):
    banco = conectar_banco()

    banco.execute(
        "DELETE FROM tarefas WHERE id = ?",
        (id,)
    )

    banco.commit()
    banco.close()

    return jsonify({
        "mensagem": "Tarefa removida"
    })

@app.route("/concluir/<int:id>", methods=["PUT"])
def concluir(id):
    banco = conectar_banco()

    tarefa = banco.execute(
        "SELECT concluida FROM tarefas WHERE id = ?",
        (id,)
    ).fetchone()

    novo_estado = 0 if tarefa["concluida"] == 1 else 1

    banco.execute(
        "UPDATE tarefas SET concluida = ? WHERE id = ?",
        (novo_estado, id)
    )

    banco.commit()
    banco.close()

    return jsonify({
        "concluida": novo_estado
    })

app.run(debug=True)