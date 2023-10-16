const mysql = require('mysql2')
const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(express.urlencoded({extended: false}))
app.use(express.static('public'));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'estoque'
});

connection.connect(function(err){
    if(err){
        console.error('Erro: ',err)
        return
    }
    console.log("Conexão estabelecida com sucesso!")
});

app.get("/formulario", function(req, res){
    res.sendFile(__dirname + "/formulario.html")
})
app.post('/adicionar', (req, res) =>{
    const descricao = req.body.descricao;
    const quant_estoque = req.body.quant_estoque;
    const valor = req.body.valor;
    const peso = req.body.peso;
    const medida = req.body.medida;
    const localizacao = req.body.localizacao;

    const values = [descricao, quant_estoque, valor, peso, medida, localizacao]
    const insert = "INSERT INTO produtos(descricao, quant_estoque, valor, peso, medida, localizacao) VALUES (?, ?, ?, ?, ?, ?)"

    connection.query(insert, values, function(err, result){
        if (!err){
            console.log("Dados inseridos com sucesso!")
            res.send("Dados inseridos!")
        } else {
            console.log("Não foi possível inserir os dados: ", err);
            res.send("Erro!")
        }
    })
})
app.get('/listar', function(req, res){
    const selectAll = "SELECT * FROM produtos;";
    connection.query(selectAll, function(err, rows){
        if (!err){
            console.log("Dados inseridos com sucesso!")
            res.send(`
            <html>
                <head>
                    <title> Produtos Cadastrados </title>
                    <link rel="stylesheet" type="text/css" href="/estilo.css">
                    <br>
                    
                    
                </head>
                <body>
                    <h1> Relatório de estoque </h1>

                <div class = "table">
                    <table border = "1">
                        <tr>
                            <th> Descrição </th>
                            <th> Quantidade em Estoque </th>
                            <th> Valor </th>
                            <th> Peso </th>
                            <th> Medida </th>
                            <th> Localização  </th>
                        </tr>
                        ${rows.map(row => ` 
                             <tr>
                                <td>${row.descricao}</td>
                                <td>${row.quant_estoque}</td>
                                <td>${row.valor}</td>
                                <td>${row.peso}</td>
                                <td>${row.medida}</td>
                                <td>${row.localizacao}</td>
                            </tr>    
                        `).join('')}
                    </table>
                </div>

                <h3 align = "center"><a href="/">Voltar para home</a><h3>
                <h3 align = "center"><a href="formulario">Cadastrar outro produto</a><h3>

                </body>    
            </html>
            `);
        } else {
            console.log("Erro ao listar os dados!: ", err);
            res.send("Erro!")
        }
    })
})

app.get("/", function(req, res){
    res.send(`
    <html>
    <head>
        <title> Sistema de Cadastro de Produtos </title>
    </head>
    <body>

    <style>



    body {
        font-family: 'Arial', sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
        text-align: center;
    }
    
    
    .field {
        margin-top: 20px;
    }
    

    
    
    a {
        display: flex;
        flex-direction: row;
        padding: 15px 30px;
        margin: 10px;
        text-decoration: none;
        color: #fff;
        background-color: #4CAF50;
        border: 1px solid #45a049;
        border-radius: 5px;
        transition: background-color 0.3s ease;
        height: 1rem;
        width: 7rem;
        align-items: center;
        justify-content: center;

    }
    
    a:hover {
        background-color: #45a049;
    }

    .box{
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    

    </style>
       
    <div class="container">
        

            <div class= "field">
                    <h1>Sistema de Gerenciamento de Produtos</h1>

                    <div class = "box">

                        <p><a href="http://localhost:8081/formulario"> Cadastrar Produtos</a href></p>
                        <p><a href="http://localhost:8081/listar"> Listar Produtos</a href></p>  

                    </div> 
            </div>
    </div>

    </body>
    </html>
    `)
})


app.listen(8081, function(){
    console.log("Servidor rodando na url http://localhost:8081")
})

