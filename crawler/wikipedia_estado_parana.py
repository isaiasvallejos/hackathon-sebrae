import requests
import psycopg2
import json
import pandas as pd
from bs4 import BeautifulSoup

def get_municipios():
    url = "https://pt.wikipedia.org/wiki/Lista_de_municípios_do_Paraná_por_população"

    req = requests.get(url)

    if req.status_code == 200:
        content = req.content

    soup = BeautifulSoup(content, 'html.parser')
    table = soup.find(name='table')

    table_str = str(table)
    df = pd.read_html(table_str)[0]

    lista = list(df['Município'])

    for i in lista:
        cidade = i.replace(" ", "_")
        # print(cidade)
        get_cidade(cidade)


def get_cidade(cidade):
    url = "https://pt.wikipedia.org/wiki/" + cidade
    req = requests.get(url)

    if req.status_code == 200:
        content = req.content

        soup = BeautifulSoup(content, 'html.parser')
        table = soup.find(name='table')

        table_str = str(table)
        df = pd.read_html(table_str)[0]

        try:
            con = psycopg2.connect(host='database-1.cehhhagbcpcv.sa-east-1.rds.amazonaws.com', database='hackathon',
                                   user='postgres', password='gigirangers')

            area = str((df.loc[df[0] == 'Área'])[1].item())
            populacao = str((df.loc[df[0] == 'População'])[1].item())
            densidade = str((df.loc[df[0] == 'Densidade'])[1].item())
            idh = str((df.loc[df[0] == 'IDH-M'])[1].item())
            pib = str((df.loc[df[0] == 'PIB'])[1].item())
            pib_capita = str((df.loc[df[0] == 'PIB per capita'])[1].item())

            dados = {"cidade": cidade, "area": area, "populacao": populacao,
                     "densidade": densidade, "idh": idh, "pib": pib, "pib_capita": pib_capita}

            print(dados)
            publicar_dados(dados)


        except BaseException:
            return
        except FutureWarning:
            return


def publicar_dados(dados):
    con = psycopg2.connect(host='database-1.cehhhagbcpcv.sa-east-1.rds.amazonaws.com', database='hackathon',
                           user='postgres', password='gigirangers')
    cur = con.cursor()
    sql = "INSERT INTO cidades (info) VALUES (%s)"
    cur.execute(sql, (json.dumps(dados),))
    con.commit()
    con.close()


def main():
    get_municipios()


if __name__ == "__main__":
    main()
