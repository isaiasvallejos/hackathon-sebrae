#import psycopg2
import requests
import re
from bs4 import BeautifulSoup

x = str(raw_input("Digite uma empresa: "))

url = "https://www.google.com/maps/search/?api=1&query=" + x
res = requests.get(url)
soup = BeautifulSoup(res.content, 'html.parser')  # g maps avi v3

# print(soup.find_all())

#print(soup.find_all('span', class_="widget-pane-link"))

try:
    # ENDERECO
    print(soup.find_all('span', class_="BNeawe tAd8D AP7Wnd"))

    # TELEFONE
    for i in soup.find_all('span', class_="BNeawe tAd8D AP7Wnd"):
        if (re.match("^\([1-9]{2}\) (?:[2-8]|9[1-9])[0-9]{3}\-[0-9]{4}$", i.get_text())):
            print(i.get_text())
except IndexError:
    print("Vazio")
