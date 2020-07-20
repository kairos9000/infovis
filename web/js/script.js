//Datum das gerade angezeigt wird soll in sliderDatum gespeichert werden
let sliderDatum = "31.12.2019";
//Gesamtes Dataset, das von d3 eingelesen wird, wird
//in globData gespeichert, um es im weiteren Verlauf zur Verfügung zu haben
let globData;
//Dataset
let file = "../data/corona_dataset.csv";
//ISO Codes der Länder der svg Datei werden in diesem Array gespeichert
let isocodes = new Array(250);
//Berechnen der jeweiligen Minima und Maxima der einzelnen Spalten des Datasets
let totalcases_max = 0;
let totalcases_min = Number.MAX_VALUE;
let newcases_max = 0;
let newcases_min = Number.MAX_VALUE;
let totaldeaths_max = 0;
let totaldeaths_min = Number.MAX_VALUE;
let newdeaths_max = 0;
let newdeaths_min = Number.MAX_VALUE;
let totalcases_permillion_max = 0;
let totalcases_permillion_min = Number.MAX_VALUE;
let newcases_permillion_max = 0;
let newcases_permillion_min = Number.MAX_VALUE;
let totaldeaths_permillion_max = 0;
let totaldeaths_permillion_min = Number.MAX_VALUE;
let newdeaths_permillion_max = 0;
let newdeaths_permillion_min = Number.MAX_VALUE;
//Damit Minima und Maxima nur einmal berechnet werden
let MinMaxBerechnet = false;
//Damit der Land-Details Container verändert werden kann
let elementLandDetails = document.getElementById("land-details");
let elementLandDetailsName = document.getElementById("land-details-name");
let elementLandDetailsDaten = document.getElementById(
    "land-details-total-cases"
);
//Farbe der Legende
let farbe;
//Farbe wird an function update() übergeben
let updateFarbe;
//Sättigung der Farbe (hsl-Modell)
let saturation = 85;
//Labels der einzelnen Legendenabschnitte
let legendenlabels = 1;
//Counter, welches Label an der Reihe ist
let labelscounter = 0;
//Skalierung der Legende für die verschiedenen Spalten des Datasets
let legendenskalierung;
//legendenlabels werden in diesem Array gespeichert,
//um sie im späteren Verlauf zur Verfügung zu haben
let legendenarray = new Array(8);
//Variable, das die ausgewählte Spalte des Datasets speichert
let ausgwSpalte;

//Funktion wird einmal ausgeführt, um die Daten zuzuordnen => Default ist total_cases
datensatzfunktion();

//Funktion, die die Legende erstellt, mit Labels versieht und die
//d3 Einbindung enthält
function datensatzfunktion() {
    //Überprüfung, welcher Radio Button ausgewählt wurde
    if (document.getElementById("tc").checked) {
        //Zuweisung der jeweiligen Attribute, damit nicht jede Legende gleich aussieht
        farbe = 35;
        //Skalierung anhand der min und max Werte der jeweiligen Spalte => function MinMaxBerechnen()
        legendenskalierung = 300000;
        legendenlabels = 0;
        labelscounter = 1;
        ausgwSpalte = "total_cases";
    }

    if (document.getElementById("nc").checked) {
        farbe = 180;
        legendenskalierung = 7000;
        legendenlabels = -3000;
        labelscounter = 1;
        ausgwSpalte = "new_cases";
    }

    if (document.getElementById("td").checked) {
        farbe = 60;
        legendenskalierung = 5000;
        legendenlabels = 0;
        labelscounter = 1;
        ausgwSpalte = "total_deaths";
    }

    if (document.getElementById("nd").checked) {
        farbe = 300;
        legendenskalierung = 800;
        legendenlabels = -2000;
        labelscounter = 1;
        ausgwSpalte = "new_deaths";
    }

    if (document.getElementById("tcpm").checked) {
        farbe = 35;
        legendenskalierung = 2000;
        legendenlabels = 0;
        labelscounter = 1;
        ausgwSpalte = "total_cases_per_million";
    }

    if (document.getElementById("ncpm").checked) {
        farbe = 180;
        legendenskalierung = 100;
        legendenlabels = -200;
        labelscounter = 1;
        ausgwSpalte = "new_cases_per_million";
    }

    if (document.getElementById("tdpm").checked) {
        farbe = 60;
        legendenskalierung = 100;
        legendenlabels = 0;
        labelscounter = 1;
        ausgwSpalte = "total_deaths_per_million";
    }

    if (document.getElementById("ndpm").checked) {
        farbe = 300;
        legendenskalierung = 17;
        legendenlabels = -50;
        labelscounter = 1;
        ausgwSpalte = "new_deaths_per_million";
    }

    //erstes Label wird gespeichert
    legendenarray[0] = legendenlabels;
    //damit die Sättigung bei mehrmaliger Ausführung der Funktion gleich bleibt
    saturation = 85;
    //Zuweisung für die function update()
    updateFarbe = farbe;

    //d3 einbindung des Datasets
    d3.csv(file).then(function (data) {
        //Zuweisung an die globale Variable
        globData = data;

        //damit der Min und Max Wert jeder Spalte nur einmal berechnet wird
        if (MinMaxBerechnet == false) {
            MinMaxBerechnen();
            MinMaxBerechnet = true;
        }

        //Legenden von vorherigen Auswahlen werden entfernt,
        //damit die jeweilige Legende angefügt wird
        d3.selectAll("text").remove();
        d3.selectAll("rect").remove();

        //Erstes rect wird angefügt
        d3.select("#legende")
            .append("rect")
            .attr("width", "10%")
            .attr("height", "20")
            .attr("y", "20px")
            .attr("style", "stroke:rgb(0,0,0);fill:#f2f2f2;")
            .attr("id", "0rect");

        //Erstes rect bekommt Text "Keine Daten"
        d3.select("#legende")
            .append("text")
            .attr("x", "0%")
            .attr("y", "15px")
            .text(function (d) {
                return "Keine Daten";
            });

        //zweites rect wird angefügt als whitespace zwischen der eigentlichen Legende
        //und "Keine Daten"
        d3.select("#legende")
            .append("rect")
            .attr("width", "10%")
            .attr("height", "20")
            .attr("x", "10%")
            .attr("y", "20px")
            .attr(
                "style",
                "stroke:rgb(0,0,0);stroke-opacity:0;fill:hsl(30,100%,100%);"
            )
            .attr("id", "1rect");

        //acht weitere rects werden angefügt, jeweils nebeneinander
        for (let i = 2; i < 10; i++) {
            d3.select("#legende")
                .append("rect")
                .attr("width", "10%")
                .attr("height", "20")
                .attr("x", i * 10 + "%")
                .attr("y", "20px")
                .attr(
                    "style",
                    "stroke:rgb(0,0,0);fill:hsl(" +
                        farbe +
                        ",100%," +
                        saturation +
                        "%)"
                )
                .attr("id", i + "rect");

            //Text der rects wird über die Skalierung festgelegt
            d3.select("#legende")
                .append("text")
                .attr("x", i * 10 + "%")
                .attr("y", "15px")
                .attr("text-anchor", "middle")
                .text(function (d) {
                    return legendenlabels.toLocaleString();
                });

            //Farbe und Sättigung wird erniedrigt, damit das nächste rect eine
            //dunklere Farbe hat => Farbabstufung
            farbe -= 5;
            saturation -= 5;

            if (i == 2) {
                legendenlabels += legendenskalierung;
                legendenarray[i - 1] = legendenlabels;
            } else {
                legendenlabels += legendenskalierung;
                legendenarray[i - 1] = legendenlabels;
            }
        }

        //update Funktion wird aufgerufen die jedem Land seine jeweilige Farbe je nach
        //Zahl im Dataset, der jeweiligen Spalte und Zeile => Farbe und Sättigung
        //ist dieselbe wie in der Legende
        update(legendenarray, updateFarbe, ausgwSpalte);

        //alle rects der Legende werden ausgewählt, und jede bekommt einen Event Listener für Hovern
        d3.selectAll("rect").each(function (d, i) {
            document
                .getElementById(this.id)
                .addEventListener("mouseover", legendenhover);

            document
                .getElementById(this.id)
                .addEventListener("mouseout", legendenhoveraus);
        });

        let counter = 0;
        d3.selectAll("path").each(function (d, i) {
            //jedes Land der svg bekommt einen Event Listener für Hovern
            let pathElement = document.getElementById(this.id);

            pathElement.addEventListener("mouseenter", landMouseIn);
            pathElement.addEventListener("mouseleave", landMouseOut);

            //ISO Codes der Länder der svg Datei werden im Array isocodes gespeichert
            isocodes[counter] = this.id;
            counter++;
        });

        //Value des Sliders wird an den Wert von sliderDatum angepasst
        setSlider();
    });
}

//Funktion die ausgeführt wird, wenn über die Elemente der Legende gehovert wird
function legendenhover() {
    //Damit die opacity jedes Landes nur einmal auf 0.5 gesetzt wird
    let opacityRunterdrehen = true;
    //intervall speichert das Datum aus dem Dataset, welches gerade gebraucht wird
    var intervall;
    //beim "whitespace" der Legende passiert nichts
    if (this.id != "1rect") {
        //Schleife geht den kompletten Datensatz durch
        for (let i = 0; i < globData.length; i++) {
            if (sliderDatum == globData[i].date) {
                //Weltdaten werden ausgelassen, da sie das Ergebnis verfälschen
                if (globData[i].iso_code != "OWID_WRL") {
                    //je nach ausgewählter Spalte wird das gewollte Datum des Datasets in
                    //"intervall" gespeichert
                    if (ausgwSpalte == "total_cases") {
                        intervall = Number.parseInt(globData[i].total_cases);
                    } else if (ausgwSpalte == "new_cases") {
                        intervall = Number.parseInt(globData[i].new_cases);
                    } else if (ausgwSpalte == "total_deaths") {
                        intervall = Number.parseInt(globData[i].total_deaths);
                    } else if (ausgwSpalte == "new_deaths") {
                        intervall = Number.parseInt(globData[i].new_deaths);
                    } else if (ausgwSpalte == "total_cases_per_million") {
                        intervall = Number.parseInt(
                            globData[i].total_cases_per_million
                        );
                    } else if (ausgwSpalte == "new_cases_per_million") {
                        intervall = Number.parseInt(
                            globData[i].new_cases_per_million
                        );
                    } else if (ausgwSpalte == "total_deaths_per_million") {
                        intervall = Number.parseInt(
                            globData[i].total_deaths_per_million
                        );
                    } else if (ausgwSpalte == "new_deaths_per_million") {
                        intervall = Number.parseInt(
                            globData[i].new_deaths_per_million
                        );
                    }

                    //die opacity der Länder, die ein Datum im Dataset an diesem Tag haben
                    //wird verringert über die ISO Codes im Dataset
                    if (this.id == "0rect") {
                        if (intervall >= legendenarray[0]) {
                            document.getElementById(
                                globData[i].iso_code
                            ).style.opacity = 0.5;
                        }
                    }

                    //Rest wird andersrum geregelt => opacity jedes Landes wird einmal verringert
                    //und dann je nach Wert von intervall wieder erhöht
                    if (opacityRunterdrehen && this.id != "0rect") {
                        for (let i = 0; i < isocodes.length; i++) {
                            if (document.getElementById(isocodes[i]) != null) {
                                document.getElementById(
                                    isocodes[i]
                                ).style.opacity = 0.5;
                            }
                        }
                        opacityRunterdrehen = false;
                    }

                    //Länder die Daten im Bereich des ersten rects haben bekommen opacity = 1;
                    //gleiche Prozedur mit dem Rest
                    if (this.id == "2rect") {
                        if (
                            intervall >= legendenarray[0] &&
                            intervall <= legendenarray[1]
                        ) {
                            document.getElementById(
                                globData[i].iso_code
                            ).style.opacity = 1;
                        }
                    }
                    if (this.id == "3rect") {
                        if (
                            intervall >= legendenarray[1] &&
                            intervall <= legendenarray[2]
                        ) {
                            document.getElementById(
                                globData[i].iso_code
                            ).style.opacity = 1;
                        }
                    }
                    if (this.id == "4rect") {
                        if (
                            intervall >= legendenarray[2] &&
                            intervall <= legendenarray[3]
                        ) {
                            document.getElementById(
                                globData[i].iso_code
                            ).style.opacity = 1;
                        }
                    }
                    if (this.id == "5rect") {
                        if (
                            intervall >= legendenarray[3] &&
                            intervall <= legendenarray[4]
                        ) {
                            document.getElementById(
                                globData[i].iso_code
                            ).style.opacity = 1;
                        }
                    }
                    if (this.id == "6rect") {
                        if (
                            intervall >= legendenarray[4] &&
                            intervall <= legendenarray[5]
                        ) {
                            document.getElementById(
                                globData[i].iso_code
                            ).style.opacity = 1;
                        }
                    }
                    if (this.id == "7rect") {
                        if (
                            intervall >= legendenarray[5] &&
                            intervall <= legendenarray[6]
                        ) {
                            document.getElementById(
                                globData[i].iso_code
                            ).style.opacity = 1;
                        }
                    }
                    if (this.id == "8rect") {
                        if (
                            intervall >= legendenarray[6] &&
                            intervall <= legendenarray[7]
                        ) {
                            document.getElementById(
                                globData[i].iso_code
                            ).style.opacity = 1;
                        }
                    }
                    if (this.id == "9rect") {
                        if (intervall >= legendenarray[7]) {
                            document.getElementById(
                                globData[i].iso_code
                            ).style.opacity = 1;
                        }
                    }
                }
            }
        }
    }
}

//wenn der Mauszeiger aus dem jeweiligen rect raus ist, wird alles
//wieder auf Standard zurückgestellt
function legendenhoveraus() {
    for (let i = 0; i < isocodes.length; i++) {
        if (document.getElementById(isocodes[i]) != null) {
            document.getElementById(isocodes[i]).style.opacity = 1;
        }
    }
}

//falls der Mauszeiger über ein Land hovert wird diese Funktion ausgeführt
function landMouseIn(event) {
    //Standardwert, der in der Details Box angezeigt wird, falls das Land an diesem Tag
    //keine Daten hat
    var landDetails = "Keine Daten";
    //kompletter Datensatz wird einmal durchgegangen ohne Weltdaten
    for (let i = 0; i < globData.length; i++) {
        //falls das Datum des Sliders und das der Reihe des Datensatzes dasselbe ist
        if (sliderDatum == globData[i].date) {
            if (globData[i].iso_code != "OWID_WRL") {
                //falls der ISO Code der gefundenen Reihe mit dem des gehoverten Landes übereinstimmt
                if (globData[i].iso_code == this.id) {
                    //je nach ausgewählter Spalte wird anderer Text in landDetails gespeichert
                    if (ausgwSpalte == "total_cases") {
                        landDetails =
                            "Gesamt Infizierte: " +
                            Number.parseInt(
                                globData[i].total_cases
                            ).toLocaleString();
                    } else if (ausgwSpalte == "new_cases") {
                        landDetails =
                            "Neu Infizierte an diesem Tag: " +
                            Number.parseInt(
                                globData[i].new_cases
                            ).toLocaleString();
                    } else if (ausgwSpalte == "total_deaths") {
                        landDetails =
                            "Gesamte Todesfälle: " +
                            Number.parseInt(
                                globData[i].total_deaths
                            ).toLocaleString();
                    } else if (ausgwSpalte == "new_deaths") {
                        landDetails =
                            "Neue Todesfälle an diesem Tag: " +
                            Number.parseInt(
                                globData[i].new_deaths
                            ).toLocaleString();
                    } else if (ausgwSpalte == "total_cases_per_million") {
                        landDetails =
                            "Gesamt Infizierte pro Millionen Menschen: " +
                            Number.parseInt(
                                globData[i].total_cases_per_million
                            ).toLocaleString();
                    } else if (ausgwSpalte == "new_cases_per_million") {
                        landDetails =
                            "Neu Infizierte an diesem Tag pro Millionen Menschen: " +
                            Number.parseInt(
                                globData[i].new_cases_per_million
                            ).toLocaleString();
                    } else if (ausgwSpalte == "total_deaths_per_million") {
                        landDetails =
                            "Gesamte Todesfälle pro Millionen Menschen: " +
                            Number.parseInt(
                                globData[i].total_deaths_per_million
                            ).toLocaleString();
                    } else if (ausgwSpalte == "new_deaths_per_million") {
                        landDetails =
                            "Neue Todesfälle an diesem Tag pro Millionen Menschen: " +
                            Number.parseInt(
                                globData[i].new_deaths_per_million
                            ).toLocaleString();
                    }
                }
            }
        }
    }

    //Koordinaten des Paths des ausgewählten Landes werden ermittelt
    let targetElement = event.target;
    let bounds = targetElement.getBoundingClientRect();

    //x und y Koordinaten der Details Box
    let x = bounds.left + bounds.width / 2;
    let y = bounds.top + bounds.height;

    //Details Box wird relativ zum Path des Landes positioniert
    elementLandDetails.style.left = x;
    elementLandDetails.style.top = y;
    elementLandDetails.classList.add("visible");

    //Name der Details Box ist Name des Landes im svg
    elementLandDetailsName.innerText = targetElement.getAttribute("data-name");

    //jeweiliger Text ist Zahl aus dem Datasets und jeweiliger
    //Text der Spalte des Datasets
    elementLandDetailsDaten.innerText = landDetails;
}

//Details Box wird bei Verlassen des Paths wieder unsichtbar
function landMouseOut() {
    elementLandDetails.classList.remove("visible");
}

//Funktion update, die die Farben der einzelnen Länder über die Daten im Dataset updatet
function update(legendenarray, farbe, spalte) {
    //alle Länder werden standardmäßig auf weiß gestellt
    for (let i = 0; i < isocodes.length; i++) {
        if (document.getElementById(isocodes[i]) != null)
            document.getElementById(isocodes[i]).style.fill = "#f2f2f2";
    }
    //Schleife geht komplettes Dataset durch außer Weltdaten
    for (let i = 0; i < globData.length; i++) {
        //wenn Datum des Sliders dasselbe ist wie in der Spalte
        if (sliderDatum == globData[i].date) {
            if (globData[i].iso_code != "OWID_WRL") {
                //je nach ausgewählter Spalte im Datensatz wird das gewollte Datum in
                //anzahl gespeichert
                if (spalte == "total_cases") {
                    var anzahl = Number.parseInt(globData[i].total_cases);
                } else if (spalte == "new_cases") {
                    var anzahl = Number.parseInt(globData[i].new_cases);
                } else if (spalte == "total_deaths") {
                    var anzahl = Number.parseInt(globData[i].total_deaths);
                } else if (spalte == "new_deaths") {
                    var anzahl = Number.parseInt(globData[i].new_deaths);
                } else if (spalte == "total_cases_per_million") {
                    var anzahl = Number.parseInt(
                        globData[i].total_cases_per_million
                    );
                } else if (spalte == "new_cases_per_million") {
                    var anzahl = Number.parseInt(
                        globData[i].new_cases_per_million
                    );
                } else if (spalte == "total_deaths_per_million") {
                    var anzahl = Number.parseInt(
                        globData[i].total_deaths_per_million
                    );
                } else if (spalte == "new_deaths_per_million") {
                    var anzahl = Number.parseInt(
                        globData[i].new_deaths_per_million
                    );
                }

                //je nachdem in welchem Intervall der Legende der Wert von "anzahl" liegt
                //bekommt das Land, dessen ISO Code in derselben Zeile steht wie anzahl
                //eine andere Färbung
                if (anzahl >= legendenarray[0] && anzahl <= legendenarray[1]) {
                    document.getElementById(globData[i].iso_code).style.fill =
                        "hsl(" + farbe + ",100%,85%)";
                } else if (
                    anzahl > legendenarray[1] &&
                    anzahl <= legendenarray[2]
                ) {
                    document.getElementById(globData[i].iso_code).style.fill =
                        "hsl(" + (farbe - 5) + ",100%,80%)";
                } else if (
                    anzahl > legendenarray[2] &&
                    anzahl <= legendenarray[3]
                ) {
                    document.getElementById(globData[i].iso_code).style.fill =
                        "hsl(" + (farbe - 10) + ",100%,75%)";
                } else if (
                    anzahl > legendenarray[3] &&
                    anzahl <= legendenarray[4]
                ) {
                    document.getElementById(globData[i].iso_code).style.fill =
                        "hsl(" + (farbe - 15) + ",100%,70%)";
                } else if (
                    anzahl > legendenarray[4] &&
                    anzahl <= legendenarray[5]
                ) {
                    document.getElementById(globData[i].iso_code).style.fill =
                        "hsl(" + (farbe - 20) + ",100%,65%)";
                } else if (
                    anzahl > legendenarray[5] &&
                    anzahl <= legendenarray[6]
                ) {
                    document.getElementById(globData[i].iso_code).style.fill =
                        "hsl(" + (farbe - 25) + ",100%,60%)";
                } else if (
                    anzahl > legendenarray[6] &&
                    anzahl <= legendenarray[7]
                ) {
                    document.getElementById(globData[i].iso_code).style.fill =
                        "hsl(" + (farbe - 30) + ",100%,55%)";
                } else {
                    document.getElementById(globData[i].iso_code).style.fill =
                        "hsl(" + (farbe - 35) + ",100%,50%)";
                }
            }
        }
    }
}

//Funktion die die Werte des Sliders ausliest
function setSlider() {
    //value des Sliders wird SliderDatum zugewiesen
    sliderDatum = document.getElementById("slider").value;

    //output ist der Paragraph unter slider
    let output = document.getElementById("slidervalue");
    //sliderDatum wird je nach value des Slider ein Datum
    //vom 31.12.2019 bis zum 02.07.2019 zugeordnet
    if (sliderDatum == 0) sliderDatum = "31.12.2019";
    if (sliderDatum == 183) sliderDatum = "01.07.2020";
    if (sliderDatum == 184) sliderDatum = "02.07.2020";

    if (sliderDatum <= 31) {
        sliderDatum = auffüllen(sliderDatum);
        sliderDatum += ".01.2020";
    }
    if (sliderDatum > 31 && sliderDatum <= 60) {
        sliderDatum = auffüllen(sliderDatum - 31);
        sliderDatum += ".02.2020";
    }

    if (sliderDatum > 60 && sliderDatum <= 91) {
        sliderDatum = auffüllen(sliderDatum - 60);
        sliderDatum += ".03.2020";
    }

    if (sliderDatum > 91 && sliderDatum <= 121) {
        sliderDatum = auffüllen(sliderDatum - 91);
        sliderDatum += ".04.2020";
    }

    if (sliderDatum > 121 && sliderDatum <= 152) {
        sliderDatum = auffüllen(sliderDatum - 121);
        sliderDatum += ".05.2020";
    }

    if (sliderDatum > 152 && sliderDatum <= 182) {
        sliderDatum = auffüllen(sliderDatum - 152);
        sliderDatum += ".06.2020";
    }

    //der Inhalt des Paragraphen unter dem slider ist sliderDatum
    output.innerHTML = sliderDatum;
    //Länder Farben werden mit neuem sliderDatum geupdatet
    update(legendenarray, updateFarbe, ausgwSpalte);
}

//Datumsangaben werden mit 0 aufgefüllt, falls sie einstellig sind
function auffüllen(val) {
    let valString = val + "";
    if (valString.length < 2) {
        return "0" + valString;
    } else {
        return valString;
    }
}

//Minuma und Maxima jeder Spalte des Datasets werden berechnet, mit Ausnahme von Weltdaten,
//da sie das Ergebnis verfälschen und kein ISO Code für die Welt im svg vorhanden ist
function MinMaxBerechnen() {
    for (let i = 0; i < globData.length; i++) {
        if (globData[i].iso_code != "OWID_WRL") {
            let totalCases = Number.parseInt(globData[i].total_cases);
            if (totalCases < totalcases_min) totalcases_min = totalCases; // totalcases_min = 0
            if (totalCases > totalcases_max) totalcases_max = totalCases; // totalcases_max = 2,686,480

            let newCases = Number.parseInt(globData[i].new_cases);
            if (newCases < newcases_min) newcases_min = newCases; // newcases_min = -2461 <= Menschen, die wieder genesen sind an diesem Tag
            if (newCases > newcases_max) newcases_max = newCases; // newcases_max = 54,771

            let totalDeaths = Number.parseInt(globData[i].total_deaths);
            if (totalDeaths < totaldeaths_min) totaldeaths_min = totalDeaths; // totaldeaths_min = 0
            if (totalDeaths > totaldeaths_max) totaldeaths_max = totalDeaths; // totaldeaths_max = 128,062

            let newDeaths = Number.parseInt(globData[i].new_deaths);
            if (newDeaths < newdeaths_min) newdeaths_min = newDeaths; // newdeaths_min = -1918
            if (newDeaths > newdeaths_max) newdeaths_max = newDeaths; // newdeaths_max = 4,928

            let totalCasesPerMillion = Number.parseInt(
                globData[i].total_cases_per_million
            );
            if (totalCasesPerMillion < totalcases_permillion_min)
                totalcases_permillion_min = totalCasesPerMillion; // totalcases_permillion_min = 0
            if (totalCasesPerMillion > totalcases_permillion_max)
                totalcases_permillion_max = totalCasesPerMillion; // totalcases_permillion_max = 33,669

            let newCasesPerMillion = Number.parseInt(
                globData[i].new_cases_per_million
            );
            if (newCasesPerMillion < newcases_permillion_min)
                newcases_permillion_min = newCasesPerMillion; // newcases_permillion_min = -139
            if (newCasesPerMillion > newcases_permillion_max)
                newcases_permillion_max = newCasesPerMillion; // newcases_permillion_max = 1,892

            let totalDeathsPerMillion = Number.parseInt(
                globData[i].total_deaths_per_million
            );
            if (totalDeathsPerMillion < totaldeaths_permillion_min)
                totaldeaths_permillion_min = totalDeathsPerMillion; // totaldeaths_permillion_min = 0
            if (totalDeathsPerMillion > totaldeaths_permillion_max)
                totaldeaths_permillion_max = totalDeathsPerMillion; // totaldeaths_permillion_max = 842

            let newDeathsPerMillion = Number.parseInt(
                globData[i].new_deaths_per_million
            );
            if (newDeathsPerMillion < newdeaths_permillion_min)
                newdeaths_permillion_min = newDeathsPerMillion; // newdeaths_permillion_min = -41
            if (newDeathsPerMillion > newdeaths_permillion_max)
                newdeaths_permillion_max = newDeathsPerMillion; // newdeaths_permillion_max = 200
        }
    }
}
