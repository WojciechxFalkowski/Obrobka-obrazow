# apo_wojciech_falkowski

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


## Spis treści

#### 1. Wprowadzenie

#### 1.1. Skład projektu

#### 1.2. Uruchomienie aplikacji

#### 2. Interfejs programu i podstawowe operacje

#### 2.1. Zamykanie programu

#### 2.2. Praca z programem

#### 3. Histogram i tablica LUT

#### 4. Rozciąganie histogramu

#### 4.1. Wyrównanie / equalizacja

#### 5. Negacja

#### 6. Progowanie binarne z progiem wskazanym suwakiem

#### 6.1. Progowanie z zachowaniem poziomów szarości z progiem wskazanym suwakiem

#### 7. Redukcja poziomów szarości przez powtórna kwantyzacje z liczba poziomów szarości wskazana przez użytkownika

#### 8. Rozciąganie histogramu z zakresu p1 – p2 do zakresu q3 – q

#### 9. Wygładzanie liniowe oparte na typowych maskach wygładzania (uśrednianie, uśrednianie z wagami, filtr gaussowski)

#### 10. Wyostrzanie liniowe na 3 maskach laplasjanowych, kierunkowa detekcja krawędzi w oparciu o maski 8 kierunkowych masek Sobela.

#### 10.1. Operacja medianowa na otoczeniu 3x3, 5x5, 7x7, 9x9 z uzupełnianiem brzegów.

#### 11. Operacje logiczne AND, OR, XOR

#### 12. Progowanie metoda Otsu, progowanie z dwoma progami z uwzględnieniem progowania z zachowanie poziomów szarości

#### 13. Segmentacja

#### 14. Błędy aplikacji

#### 15. Dodatkowe elementy aplikacji

#### 16. Projekt


### 1. Wprowadzenie

Projekt został zrealizowany w ramach programu implementującego funkcjonalności do obróbki 
obrazów, który został wykonany w języku JavaScript z wykorzystaniem
biblioteki OpenCV i frameworka electron.js do tworzenia aplikacji desktop’owych.

### 1.1. Projekt składa się z:
- folderu „public” gdzie można znaleźć wykorzystane czcionki w projekcie, przykładowe obrazy, 
  biblioteke OpenCV
- folderu „images” w którym znajdują się zdjęcia w tym svg wykorzystane w projekcie
- folderu „src” zawierające wszystkie komponenty i logikę biznesową projektu
- linku pod którym można pobrać wersję produkcyjną programu „apo_wojciech_falkowski.exe”
  [link](https://ln5.sync.com/dl/13414bfc0/tcxhqnks-xzc77mnf-7tgxwj9m-4r43k3vx)
  
### 1.2. Uruchomienie aplikacji

#### Aby uruchomić aplikację należy pobrać plik „apo_wojciech_falkowski.exe” ([link](https://ln5.sync.com/dl/13414bfc0/tcxhqnks-xzc77mnf-7tgxwj9m-4r43k3vx)) i uruchomić na własnym komputerze

### 1.3. Uruchomienie aplikacji (wersja developerska)

#### -

### 2. Interfejs programu i podstawowe operacje

<p align="center">
  <img src="https://github.com/WojciechxFalkowski/apo-electron/blob/main/images/readme/2.png?raw=true"alt="Home page"/>
</p>

#### Po uruchomieniu aplikacji wyświetla się okno główne programu.

Aplikacja składa się z menu górnego z dwoma przyciskami „Obraz” i „Operacje” oraz miejsca gdzie będą
pokazywane dane operacje aplikacji.

### 2.1. Zamykanie programu
<p align="center">
  <img src="https://github.com/WojciechxFalkowski/apo-electron/blob/main/images/readme/2.1.a.png?raw=true"alt="Home page"/>
</p>

#### Aby zamknąć program należy kliknąć na ikonę krzyżyka w prawym górnym rogu okna głównego
<p align="center">
  <img src="https://github.com/WojciechxFalkowski/apo-electron/blob/main/images/readme/2.1.png?raw=true"alt="Home page"/>
</p>

### 2.2. Praca z programem

Aby zacząć prace z programem na sam początek należy dodać zdjęcia do „bazy projektu” –
zdjęcia są przechowywane w miejscu gdzie aplikacja w utworzonym folderze ‘uploads’.

Po kliknięciu przycisku ‘Dodaj plik’ ukaże się okno, gdzie może wybrać zdjęcie, które ma zostać
dodane do projektu. W moim przypadku jest to plik ‘lena.jpg’. Uwaga do poprawnego działania
aplikacji należy korzystać z formatów plików ‘.png’, ‘.jpg’, ‘.bmp’.

<p align="center">
  <img src="https://github.com/WojciechxFalkowski/apo-electron/blob/main/images/readme/2.2.a.png?raw=true"alt="Home page"/>
</p>

<p align="center">
  <img src="https://github.com/WojciechxFalkowski/apo-electron/blob/main/images/readme/2.2.b.png?raw=true"alt="Home page"/>
</p>

Po wgraniu zdjęcia obraz będzie wyświetlony w prawej części okna aplikacji, aby zacząć prace
nad nim należy kliknąć przycisk „+”.

<p align="center">
  <img src="https://github.com/WojciechxFalkowski/apo-electron/blob/main/images/readme/2.2.c.png?raw=true"alt="Home page"/>
</p>

<p align="center">
  <img src="https://github.com/WojciechxFalkowski/apo-electron/blob/main/images/readme/2.2.d.png?raw=true"alt="Home page"/>
</p>

### 3. Histogram i tablica LUT

```
Z menu górnego należy wybrać opcje ‘Obraz’ -> ‘Zdjęcia’
```
Następnie należy kliknąć w obraz, aby pokazały nam się dane na jego temat (histogram i tablica LUT).

Obraz w zależności czy jest szaro odcieniowy czy tez nie pokaże nam innej opcje histogramu (GRAY /
RGB). Dodatkowo histogram ma możliwość wyodrębnienia konkretnego kanału (R/G/B) dla obrazów
kolorowych.


### 4. Rozciąganie histogramu

```
Z menu górnego należy wybrać opcje ‘Operacje’ -> ‘Rozciągnij / wyrównaj histogram’
```
```
Po przejściu na dana podstronę ukaże nam się tylko obraz po lewej stronie (bazowy).
Użytkownik ma możliwość wybrania zakresu jaki go interesuje przykładowo zaznaczyłem zakres
60 - 200 po wciśnięciu przycisku ‘Rozciągnij histogram’ zostanie wygenerowany obraz wynikowy.
```

### 4.1. Wyrównanie / equalizacja

### 5. Negacja

### 6. Progowanie binarne z progiem wskazywanym suwakiem

### 6.1. Progowanie z zachowaniem poziomów szarości z progiem wskazywanym suwakiem

### 7. Redukcja poziomów szarości przez powtórna kwantyzacje z liczba poziomów szarości wskazana przez użytkownika

### 8. Rozciąganie histogramu z zakresu p1-p2 do zakresu q3-q

### 9. Wygładzanie liniowe oparte na typowych maskach

### wygładzania(uśrednianie, uśrednianie z wagami, filtr gaussowski)



### 10. Wyostrzanie liniowe na 3 maskach laplasjanowych, kierunkowa detekcja krawędzi w oparciu o maski 8 kierunkowych masek Sobela

#### UWAGA – openCV dla javascript’u udostępnia tylko detekcje krawędzi w osi X i Y, detekcja krawędzi operatorem opartym na masce Cannyego.

### 10.1. Operacja medianowa na otoczeniu 3x3, 5x5, 7x7, 9x9 z uzupełnianiem brzegów.

### 11. Operacje logiczne AND, OR, XOR

### Aby wykonać operacje na wielu obrazach trzeba mieć zaznaczone minimum 2 obrazy. Następnie w menu górnym zostaną pokazane opcje, które można wykonać z dana liczba obrazów

### 12. Progowanie metoda Otsu, progowanie z dwoma progami z uwzględnieniem progowania z zachowanie poziomów szarości

### 13. Segmentacja

### 14. Błędy aplikacji

```
W histogramie nie zawsze zaznaczony jest który wykres jest pokazany
```

### 15. Dodatkowe elementy aplikacji:

```
1) Aplikacja bada stan aktywnych zdjęć przez co nie można wejść na dane podstrony, jeżeli mamy
np. niewystarczająca ilość zaznaczonych zdjęć -> operacje logiczne – 2 obrazy
```
```
2) Aplikacja sprawdza czy posiada już obraz wynikowy i dopiero jeżeli go posiada to pozwala zapisac
obraz
```

### 16. Projekt

Obraz kolorowy nie ma oddzielenia informacji o chromie (kolorze) od informacji o jasności. Dopiero
przejście na model Lab daje nam możliwość oddzielenia tych dwóch typów informacji. Informacje o
intensywnościach, które będę modyfikował będą znajdowały się w kanale „L”, a informacje o kolorach w
kanałach „a” i „b”.
