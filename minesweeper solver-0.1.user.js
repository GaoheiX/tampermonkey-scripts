// ==UserScript==
// @name         minesweeper solver
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://minesweeper.online/game/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=minesweeper.online
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  var matrix = new Array();
  var table_x = 0;
  var table_y = 0;

  $(document).ready(function () {
    console.log("betöltődött az oldal");
    // az oldal betöltése esetén 1 másodpercig várunk, hogy minden element betöltődjön
    window.setTimeout(function () {
      console.log("meghívjuk a doThings-et");
      doThings();
    }, 1000);
  });

  function doThings() {
    console.log("doThings elkezdett futni");

    // meghatározzuk, hogy mekkora a pálya
    while ($("#cell_" + table_x + "_0").length > 0) {
      table_x++;
    }

    while ($("#cell_0_" + table_y).length > 0) {
      table_y++;
    }

    console.log("A pálya mérete: " + table_x + " " + table_y);

    // -1 még nincs kinyitva; 0: nincs ott semmi a környéken; 1: 1 van a környéken... x: bomba helye
    matrix = Array(table_x)
      .fill()
      .map(() => Array(table_y).fill(-1));

    // ez meg aztán elfut magába
    var i = setInterval(function () {
      // console.log("fut a belső fő rész");

      for (let y = 0; y < table_y; y++) {
        for (let x = 0; x < table_x; x++) {
          // feltöltjük a mátrixot, és innentől ezzel dolgozunk
          if ($("#cell_" + x + "_" + y).hasClass("hd_closed"))
            matrix[x][y] = -1;
          if ($("#cell_" + x + "_" + y).hasClass("hd_flag")) matrix[x][y] = "x";
          if ($("#cell_" + x + "_" + y).hasClass("hd_type12"))
            matrix[x][y] = "x";
          if ($("#cell_" + x + "_" + y).hasClass("hd_type0")) matrix[x][y] = 0;
          if ($("#cell_" + x + "_" + y).hasClass("hd_type1")) matrix[x][y] = 1;
          if ($("#cell_" + x + "_" + y).hasClass("hd_type2")) matrix[x][y] = 2;
          if ($("#cell_" + x + "_" + y).hasClass("hd_type3")) matrix[x][y] = 3;
          if ($("#cell_" + x + "_" + y).hasClass("hd_type4")) matrix[x][y] = 4;
          if ($("#cell_" + x + "_" + y).hasClass("hd_type5")) matrix[x][y] = 5;
          if ($("#cell_" + x + "_" + y).hasClass("hd_type6")) matrix[x][y] = 6;
          if ($("#cell_" + x + "_" + y).hasClass("hd_type7")) matrix[x][y] = 7;
          if ($("#cell_" + x + "_" + y).hasClass("hd_type8")) matrix[x][y] = 8;

          // először is, ha van már bekapcsolt szín amire már kattintottam, akkor azt levehetjük
          if (
            $("#cell_" + x + "_" + y).hasClass("hd_opened") ||
            $("#cell_" + x + "_" + y).hasClass("hd_flag")
          ) {
            $("#cell_" + x + "_" + y)
              // .css("background", "")
              // .css("opacity", "1")
              .removeClass("hint-to-open");
          }
        }
      }
      // használat -> console.log("0:0 -> " + matrix[0][0]);

      for (let y = 0; y < table_y; y++) {
        for (let x = 0; x < table_x; x++) {
          for (let c = 1; c <= 8; c++) {
            if (matrix[x][y] == c) {
              // ha a szomszédos bombák száma és az ismeretlenek száma pont az adott érték, akkor az ismeretlenek mind bombák
              if (
                hanyIlyenVanAKornyezeteben(x, y, "x") +
                  hanyIlyenVanAKornyezeteben(x, y, -1) ==
                c
              ) {
                // jeloldMegAzOsszesIsmeretlenSzomszedot(x, y, "red");
                jeloldMegAzOsszesIsmeretlenAknat(x, y);
              }
              // a környezetében már van bomba, akkor a többi ismeretlen (-1) mezőt zöldre lehet jelölni
              if (hanyIlyenVanAKornyezeteben(x, y, "x") == c) {
                // jeloldMegAzOsszesIsmeretlenSzomszedotSzinnel(x, y, "lightgreen");
                jeloldMegAzOsszesIsmeretlenSzomszedotStilussal(
                  x,
                  y,
                  "hint-to-open"
                );
              }
            }
          }
        }
      }
    }, 1000);
  }

  function getField(x, y) {
    if (x < 0) return "O";
    if (x >= table_x) return "O";
    if (y < 0) return "O";
    if (y >= table_y) return "O";
    return matrix[x][y];
  }

  function hanyIlyenVanAKornyezeteben(x, y, ilyen) {
    var aknaszam = 0;
    if (getField(x - 1, y - 1) == ilyen) aknaszam += 1;
    if (getField(x - 1, y) == ilyen) aknaszam += 1;
    if (getField(x - 1, y + 1) == ilyen) aknaszam += 1;
    if (getField(x, y - 1) == ilyen) aknaszam += 1;
    if (getField(x, y + 1) == ilyen) aknaszam += 1;
    if (getField(x + 1, y - 1) == ilyen) aknaszam += 1;
    if (getField(x + 1, y) == ilyen) aknaszam += 1;
    if (getField(x + 1, y + 1) == ilyen) aknaszam += 1;

    return aknaszam;
  }

  function jeloldMegAzOsszesIsmeretlenSzomszedotSzinnel(x, y, szin) {
    if (getField(x - 1, y - 1) == -1)
      $("#cell_" + (x - 1) + "_" + (y - 1))
        .css("background", szin)
        .css("opacity", "0.3");
    if (getField(x - 1, y) == -1)
      $("#cell_" + (x - 1) + "_" + y)
        .css("background", szin)
        .css("opacity", "0.3");
    if (getField(x - 1, y + 1) == -1)
      $("#cell_" + (x - 1) + "_" + (y + 1))
        .css("background", szin)
        .css("opacity", "0.3");
    if (getField(x, y - 1) == -1)
      $("#cell_" + x + "_" + (y - 1))
        .css("background", szin)
        .css("opacity", "0.3");
    if (getField(x, y + 1) == -1)
      $("#cell_" + x + "_" + (y + 1))
        .css("background", szin)
        .css("opacity", "0.3");
    if (getField(x + 1, y - 1) == -1)
      $("#cell_" + (x + 1) + "_" + (y - 1))
        .css("background", szin)
        .css("opacity", "0.3");
    if (getField(x + 1, y) == -1)
      $("#cell_" + (x + 1) + "_" + y)
        .css("background", szin)
        .css("opacity", "0.3");
    if (getField(x + 1, y + 1) == -1)
      $("#cell_" + (x + 1) + "_" + (y + 1))
        .css("background", szin)
        .css("opacity", "0.3");
  }

  function jeloldMegAzOsszesIsmeretlenSzomszedotStilussal(x, y, stilus) {
    if (getField(x - 1, y - 1) == -1)
      $("#cell_" + (x - 1) + "_" + (y - 1)).addClass(stilus);
    if (getField(x - 1, y) == -1)
      $("#cell_" + (x - 1) + "_" + y).addClass(stilus);
    if (getField(x - 1, y + 1) == -1)
      $("#cell_" + (x - 1) + "_" + (y + 1)).addClass(stilus);
    if (getField(x, y - 1) == -1)
      $("#cell_" + x + "_" + (y - 1)).addClass(stilus);
    if (getField(x, y + 1) == -1)
      $("#cell_" + x + "_" + (y + 1)).addClass(stilus);
    if (getField(x + 1, y - 1) == -1)
      $("#cell_" + (x + 1) + "_" + (y - 1)).addClass(stilus);
    if (getField(x + 1, y) == -1)
      $("#cell_" + (x + 1) + "_" + y).addClass(stilus);
    if (getField(x + 1, y + 1) == -1)
      $("#cell_" + (x + 1) + "_" + (y + 1)).addClass(stilus);
  }

  function jeloldMegAzOsszesIsmeretlenAknat(x, y) {
    var stilus = "hd_type12";
    if (getField(x - 1, y - 1) == -1) {
      $("#cell_" + (x - 1) + "_" + (y - 1))
        .addClass(stilus)
        .removeClass("hd_closed");
      // matrix[x - 1][y - 1] = "x";
    }
    if (getField(x - 1, y) == -1) {
      $("#cell_" + (x - 1) + "_" + y)
        .addClass(stilus)
        .removeClass("hd_closed");
      // matrix[x - 1][y] = "x";
    }
    if (getField(x - 1, y + 1) == -1) {
      $("#cell_" + (x - 1) + "_" + (y + 1))
        .addClass(stilus)
        .removeClass("hd_closed");
      // matrix[x - 1][y + 1] = "x";
    }
    if (getField(x, y - 1) == -1) {
      $("#cell_" + x + "_" + (y - 1))
        .addClass(stilus)
        .removeClass("hd_closed");
      // matrix[x][y - 1] = "x";
    }
    if (getField(x, y + 1) == -1) {
      $("#cell_" + x + "_" + (y + 1))
        .addClass(stilus)
        .removeClass("hd_closed");
      // matrix[x][y + 1] = "x";
    }
    if (getField(x + 1, y - 1) == -1) {
      $("#cell_" + (x + 1) + "_" + (y - 1))
        .addClass(stilus)
        .removeClass("hd_closed");
      // matrix[x + 1][y - 1] = "x";
    }
    if (getField(x + 1, y) == -1) {
      $("#cell_" + (x + 1) + "_" + y)
        .addClass(stilus)
        .removeClass("hd_closed");
      // matrix[x + 1][y] = "x";
    }
    if (getField(x + 1, y + 1) == -1) {
      $("#cell_" + (x + 1) + "_" + (y + 1))
        .addClass(stilus)
        .removeClass("hd_closed");
      // matrix[x + 1][y + 1] = "x";
    }
  }
})();
