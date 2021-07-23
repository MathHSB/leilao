const express = require("express");
const app = express();
const port = 3030;
const connection = require("./database/database");
const Produtos = require("./database/Produtos");
const Pessoas = require("./database/Pessoas");
const Lances = require("./database/Lances");
const Ranking = require("./database/Ranking");

app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

try {
  connection.authenticate();
  console.log("Conexão bem sucedida");
} catch (err) {
  console.log(err);
}

app.get("/", (req, res) => {
  res.render("pessoa");
});

app.get("/produto", (req, res) => {
  res.render("produto");
});

app.get("/pessoa", (req, res) => {
  res.render("pessoa");
});

app.get("/darLance", (req, res) => {
  res.render("lances");
});

app.get("/listalances", (req, res) => {
  res.render("listalances");
});

app.get("/errolance", (req, res) => {
  res.render("errolance");
});

app.post("/cadastrarPessoa", (req, res) => {
  const nome = req.body.nome;
  const idade = req.body.idade;

  if (idade > 18) {
    try {
      Pessoas.create({
        nome: nome,
        idade: idade,
      }).then(() => {
        Pessoas.findOne({
          where: {
            nome: nome,
          },
        }).then((pessoa) => {
          res.render("produto", {
            pessoa: pessoa,
          });
        });
      });
    } catch (err) {
      console.log(err);
    }
  } else {
    res.render("erro");
  }
});

app.post("/cadastrarProduto", (req, res) => {
  const produto = req.body.produto;
  const valor = req.body.valor;
  const pessoa_id = req.body.pessoa_id;

  try {
    Produtos.create({
      produto: produto,
      valor: valor,
    }).then(() => {
      Produtos.findAll({
        attributes: ["id", "produto", "valor"],
      }).then((itemProduto) => {
        Pessoas.findOne({
          where: {
            id: pessoa_id,
          },
        }).then((pessoa) => {
          res.render("lances", {
            produto: itemProduto,
            pessoa_id: pessoa_id,
            pessoa: pessoa,
            valor: valor,
          });
        });
      });
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/darLance", (req, res) => {
  const pessoa_id = req.body.pessoa_id;
  const produto_id = req.body.produto_id;
  const valorLance = req.body.valorLance;
  const lanceInicial = req.body.valor;

  try {
    Ranking.create({
      produto_id: produto_id,
      nome: "Lance Inicial",
      valorLance: lanceInicial,
    }).then(() => {
      Lances.create({
        pessoa_id: pessoa_id,
        produto_id: produto_id,
        valorLance: valorLance,
      }).then(() => {
        Produtos.findOne({
          where: {
            id: produto_id,
          },
        }).then((produto) => {
          Lances.findOne({
            where: {
              pessoa_id: pessoa_id,
            },
            raw: false,
          }).then((lance) => {
            Pessoas.findOne({
              raw: false,
              where: {
                id: pessoa_id,
              },
            }).then((pessoa) => {
              Ranking.create({
                nome: pessoa.nome,
                produto_id: produto_id,
                valorLance: lance.valorLance,
              }).then(() => {
                Ranking.findAll({
                  where: {
                    produto_id: produto_id,
                  },
                  raw: false,
                  order: [["valorLance", "DESC"]],
                }).then((ranking) => {
                  if (valorLance < ranking[1].valorLance) {
                    console.log(valorLance);
                    console.log(ranking[0].valorLance);
                    Ranking.destroy({
                      where: {
                        nome: "Lance Inicial",
                      },
                    }).then(() => {
                      Ranking.destroy({
                        where: {
                          valorLance: valorLance,
                        },
                      }).then(() => {
                        Ranking.findAll({
                          where: {
                            produto_id: produto_id,
                          },
                          raw: false,
                          order: [["valorLance", "DESC"]],
                        }).then((novoranking) => {
                          res.render("errolance", {
                            ranking: novoranking,
                            produto: produto,
                          });
                        });
                      });
                    });
                  } else {
                    res.render("listalances", {
                      produto: produto,
                      lance: lance,
                      pessoa: pessoa,
                      ranking: ranking,
                    });
                  }
                });
              });
            });
          });
        });
      });
    });
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log("App rodando");
});
