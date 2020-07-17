let slider = "31.12.2019";
let globData;
let file = "corona_dataset.csv";
let isocodes = new Array(250);
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
let MinMaxBerechnet = false;
let rectsArray = new Array(10);
let elementLandDetails = document.getElementById("land-details");
let elementLandDetailsName = document.getElementById("land-details-name");
let elementLandDetailsTotalCases = document.getElementById(
    "land-details-total-cases"
);
let farbe;
let updateFarbe;
let saturation = 85;
let legendenlabels = 1;
let labelscounter = 0;
let legendenskalierung;
let label;
let legendenarray = new Array(8);
let ausgwDatensatz;

datensatzfunktion();

function datensatzfunktion() {
    if (document.getElementById("tc").checked) {
        farbe = 35;
        legendenskalierung = 300000;
        legendenlabels = 0;
        label = 0;
        labelscounter = 1;
        ausgwDatensatz = "total_cases";
    }

    if (document.getElementById("nc").checked) {
        farbe = 180;
        legendenskalierung = 7000;

        legendenlabels = -3000;
        label = -3000;
        labelscounter = 1;
        ausgwDatensatz = "new_cases";
    }

    if (document.getElementById("td").checked) {
        farbe = 60;
        legendenskalierung = 5000;

        legendenlabels = 0;
        label = 0;
        labelscounter = 1;
        ausgwDatensatz = "total_deaths";
    }

    if (document.getElementById("nd").checked) {
        farbe = 300;
        legendenskalierung = 800;

        legendenlabels = -2000;
        label = -2000;
        labelscounter = 1;
        ausgwDatensatz = "new_deaths";
    }

    if (document.getElementById("tcpm").checked) {
        farbe = 35;
        legendenskalierung = 2000;

        legendenlabels = 0;
        label = 0;
        labelscounter = 1;
        ausgwDatensatz = "total_cases_per_million";
    }

    if (document.getElementById("ncpm").checked) {
        farbe = 180;
        legendenskalierung = 100;

        legendenlabels = -200;
        label = -200;
        labelscounter = 1;
        ausgwDatensatz = "new_cases_per_million";
    }

    if (document.getElementById("tdpm").checked) {
        farbe = 60;
        legendenskalierung = 100;

        legendenlabels = 0;
        label = 0;
        labelscounter = 1;
        ausgwDatensatz = "total_deaths_per_million";
    }

    if (document.getElementById("ndpm").checked) {
        farbe = 300;
        legendenskalierung = 17;

        legendenlabels = -50;
        label = -50;
        labelscounter = 1;
        ausgwDatensatz = "new_deaths_per_million";
    }

    legendenarray[0] = label;
    saturation = 85;
    updateFarbe = farbe;

    d3.csv(file).then(function (data) {
        globData = data;

        if (MinMaxBerechnet == false) {
            MinMaxBerechnen();
            MinMaxBerechnet = true;
        }

        d3.selectAll("text").remove();
        d3.selectAll("rect").remove();

        d3.select("#legende")
            .append("rect")
            .attr("width", "10%")
            .attr("height", "20")
            .attr("y", "20px")
            .attr("style", "stroke:rgb(0,0,0);stroke-width:2;fill:#f2f2f2;")
            .attr("id", "0rect");

        d3.select("#legende")
            .append("text")
            .attr("x", "0%")
            .attr("y", "15px")
            .text(function (d) {
                return "Keine Daten";
            });

        d3.select("#legende")
            .append("rect")
            .attr("width", "10%")
            .attr("height", "20")
            .attr("x", "10%")
            .attr("y", "20px")
            .attr(
                "style",
                "stroke:rgb(0,0,0);stroke-width:1;stroke-opacity:0;fill:hsl(30,100%,100%);"
            )
            .attr("id", "1rect");

        for (let i = 2; i < 10; i++) {
            d3.select("#legende")
                .append("rect")
                .attr("width", "10%")
                .attr("height", "20")
                .attr("x", i * 10 + "%")
                .attr("y", "20px")
                .attr(
                    "style",
                    "stroke:rgb(0,0,0);stroke-width:2;fill:hsl(" +
                        farbe +
                        ",100%," +
                        saturation +
                        "%)"
                )
                .attr("id", i + "rect");

            d3.select("#legende")
                .append("text")
                .attr("x", i * 10 + "%")
                .attr("y", "15px")
                .attr("text-anchor", "middle")
                .text(function (d) {
                    return label.toLocaleString();
                });

            farbe -= 5;
            saturation -= 5;

            if (i == 2) {
                legendenlabels += legendenskalierung;
                label = legendenlabels;
                legendenarray[i - 1] = label;
            } else {
                legendenlabels += legendenskalierung;
                label = legendenlabels;
                legendenarray[i - 1] = label;
            }
        }

        update(legendenarray, updateFarbe, ausgwDatensatz);

        d3.selectAll("rect").each(function (d, i) {
            document
                .getElementById(this.id)
                .addEventListener("mouseover", legendenhover);

            document
                .getElementById(this.id)
                .addEventListener("mouseout", legendenhoveraus);

            rectsArray[i] = this.id;
        });
        let counter = 0;
        d3.selectAll("path").each(function (d, i) {
            let pathElement = document.getElementById(this.id);

            pathElement.addEventListener("mouseenter", landMouseIn);
            pathElement.addEventListener("mouseleave", landMouseOut);

            isocodes[counter] = this.id;
            counter++;
        });
        setSlider();
    });
}

function legendenhover() {
    let opacityRunterdrehen = true;
    document.getElementById(this.id).style.strokeWidth = "3";
    var intervall;
    if (this.id != "1rect") {
        for (let i = 0; i < globData.length; i++) {
            if (slider == globData[i].date) {
                if (globData[i].iso_code != "OWID_WRL") {
                    if (ausgwDatensatz == "total_cases") {
                        intervall = Number.parseInt(globData[i].total_cases);
                    } else if (ausgwDatensatz == "new_cases") {
                        intervall = Number.parseInt(globData[i].new_cases);
                    } else if (ausgwDatensatz == "total_deaths") {
                        intervall = Number.parseInt(globData[i].total_deaths);
                    } else if (ausgwDatensatz == "new_deaths") {
                        intervall = Number.parseInt(globData[i].new_deaths);
                    } else if (ausgwDatensatz == "total_cases_per_million") {
                        intervall = Number.parseInt(
                            globData[i].total_cases_per_million
                        );
                    } else if (ausgwDatensatz == "new_cases_per_million") {
                        intervall = Number.parseInt(
                            globData[i].new_cases_per_million
                        );
                    } else if (ausgwDatensatz == "total_deaths_per_million") {
                        intervall = Number.parseInt(
                            globData[i].total_deaths_per_million
                        );
                    } else if (ausgwDatensatz == "new_deaths_per_million") {
                        intervall = Number.parseInt(
                            globData[i].new_deaths_per_million
                        );
                    }

                    if (this.id == "0rect") {
                        if (intervall >= legendenarray[0]) {
                            document.getElementById(
                                globData[i].iso_code
                            ).style.opacity = 0.5;
                        }
                    }

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
                            ).style.opacity = 0.5;
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

function legendenhoveraus() {
    document.getElementById(this.id).style.strokeWidth = "2";
    for (let i = 0; i < isocodes.length; i++) {
        if (document.getElementById(isocodes[i]) != null) {
            document.getElementById(isocodes[i]).style.opacity = 1;
        }
    }
}

function landMouseIn(event) {
    var landAnzahl = "Keine Daten";
    for (let i = 0; i < globData.length; i++) {
        if (slider == globData[i].date) {
            if (globData[i].iso_code != "OWID_WRL") {
                if (globData[i].iso_code == this.id) {
                    if (ausgwDatensatz == "total_cases") {
                        landAnzahl =
                            "Gesamte Infizierte: " +
                            Number.parseInt(
                                globData[i].total_cases
                            ).toLocaleString();
                    } else if (ausgwDatensatz == "new_cases") {
                        landAnzahl =
                            "Neue Infizierte an diesem Tag: " +
                            Number.parseInt(
                                globData[i].new_cases
                            ).toLocaleString();
                    } else if (ausgwDatensatz == "total_deaths") {
                        landAnzahl =
                            "Gesamte Todesfälle: " +
                            Number.parseInt(
                                globData[i].total_deaths
                            ).toLocaleString();
                    } else if (ausgwDatensatz == "new_deaths") {
                        landAnzahl =
                            "Neue Todesfälle an diesem Tag: " +
                            Number.parseInt(
                                globData[i].new_deaths
                            ).toLocaleString();
                    } else if (ausgwDatensatz == "total_cases_per_million") {
                        landAnzahl =
                            "Gesamte Infizierte pro Millionen Menschen: " +
                            Number.parseInt(
                                globData[i].total_cases_per_million
                            ).toLocaleString();
                    } else if (ausgwDatensatz == "new_cases_per_million") {
                        landAnzahl =
                            "Neue Infizierte an diesem Tag pro Millionen Menschen: " +
                            Number.parseInt(
                                globData[i].new_cases_per_million
                            ).toLocaleString();
                    } else if (ausgwDatensatz == "total_deaths_per_million") {
                        landAnzahl =
                            "Gesamte Todesfälle pro Millionen Menschen: " +
                            Number.parseInt(
                                globData[i].total_deaths_per_million
                            ).toLocaleString();
                    } else if (ausgwDatensatz == "new_deaths_per_million") {
                        landAnzahl =
                            "Neue Todesfälle an diesem Tag pro Millionen Menschen: " +
                            Number.parseInt(
                                globData[i].new_deaths_per_million
                            ).toLocaleString();
                    }
                }
            }
        }
    }
    let targetElement = event.target;
    let bounds = targetElement.getBoundingClientRect();

    let x = bounds.left + bounds.width / 2;
    let y = bounds.top + bounds.height;

    elementLandDetails.style.left = x;
    elementLandDetails.style.top = y;
    elementLandDetails.classList.add("visible");

    elementLandDetailsName.innerText = targetElement.getAttribute("data-name");

    elementLandDetailsTotalCases.innerText = landAnzahl;

    //console.log(document.getElementById(this.id).getAttribute("style"));
}

function landMouseOut() {
    elementLandDetails.classList.remove("visible");
}

function update(legendenarray, farbe, spalte) {
    for (let i = 0; i < isocodes.length; i++) {
        if (document.getElementById(isocodes[i]) != null)
            document.getElementById(isocodes[i]).style.fill = "#f2f2f2";
    }
    for (let i = 0; i < globData.length; i++) {
        if (slider == globData[i].date) {
            if (globData[i].iso_code != "OWID_WRL") {
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
                    anzahl > legendenarray[7] &&
                    anzahl <= legendenarray[8]
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

function setSlider() {
    slider = document.getElementById("slider").value;

    let output = document.getElementById("slidervalue");
    if (slider == 0) slider = "31.12.2019";
    if (slider == 183) slider = "01.07.2020";
    if (slider == 184) slider = "02.07.2020";
    for (let i = 1; i <= 182; i++) {
        if (i <= 31) {
            if (slider == i) {
                i = auffüllen(i);
                slider = i + ".01.2020";
            }
        }
        if (i > 31 && i <= 60) {
            if (slider == i) {
                i = auffüllen(i - 31);
                slider = i + ".02.2020";
            }
        }

        if (i > 60 && i <= 91) {
            if (slider == i) {
                i = auffüllen(i - 60);
                slider = i + ".03.2020";
            }
        }

        if (i > 91 && i <= 121) {
            if (slider == i) {
                i = auffüllen(i - 91);
                slider = i + ".04.2020";
            }
        }

        if (i > 121 && i <= 152) {
            if (slider == i) {
                i = auffüllen(i - 121);
                slider = i + ".05.2020";
            }
        }

        if (i > 152 && i <= 182) {
            if (slider == i) {
                i = auffüllen(i - 152);
                slider = i + ".06.2020";
            }
        }
    }
    output.innerHTML = slider;
    update(legendenarray, updateFarbe, ausgwDatensatz);
}

function auffüllen(val) {
    let valString = val + "";
    if (valString.length < 2) {
        return "0" + valString;
    } else {
        return valString;
    }
}

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
