var slider = "31.12.2019";
var globData;
let file = "corona_dataset.csv";
var isocodes = new Array(250);
var totalcases_max = 0;
var totalcases_min = Number.MAX_VALUE;

d3.csv(file).then(function (data) {
    globData = data;
    for (var i = 0; i < data.length; i++) {
        var total = Number.parseInt(data[i].totalcases);

        if (total < totalcases_min) totalcases_min = total;
        if (total > totalcases_max) totalcases_max = total;
    }

    var farbe = 35;
    var saturation = 90;

    d3.select("#legende")
        .append("rect")
        .attr("width", "10%")
        .attr("height", "20")
        .attr("y", "20px")
        .attr("style", "stroke:rgb(0,0,0);stroke-width:2;fill:#f2f2f2;")
        .attr("id", "0rect")
        .append("text")
        .attr("x", "10%")
        .attr("y", "100%")
        .text(function (d) {
            return "No Info";
        })
        .attr("font-size", "20px")
        .attr("fill", "red");

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
    var legendenlabels = 1;
    var labelscounter = 0;
    for (var i = 2; i < 10; i++) {
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
                return legendenlabels * labelscounter;
            });

        farbe -= 5;
        saturation -= 5;

        if (i == 2) {
            labelscounter++;
            labelscounter *= 10;
        } else labelscounter *= 10;
    }

    d3.selectAll("rect").each(function (d, i) {
        document
            .getElementById(this.id)
            .addEventListener("mouseover", legendenhover);
        document
            .getElementById(this.id)
            .addEventListener("mouseout", legendenhoveraus);
    });
    var counter = 0;
    d3.selectAll("path").each(function (d, i) {
        document
            .getElementById(this.id)
            .addEventListener("click", landfunktion);

        isocodes[counter] = this.id;
        counter++;
    });
    console.log(isocodes);
    setSlider();
});

function legendenhover() {
    document.getElementById(this.id).style.strokeWidth = "3";
}

function legendenhoveraus() {
    document.getElementById(this.id).style.strokeWidth = "2";
}

function landfunktion() {
    document.getElementById(this.id).style.fill = "hsl(0,100%,50%)";
}

function update() {
    for (var i = 0; i < isocodes.length; i++) {
        if (document.getElementById(isocodes[i]) != null)
            document.getElementById(isocodes[i]).style.fill = "#f2f2f2";
    }
    for (var i = 0; i < globData.length; i++) {
        if (slider == globData[i].date) {
            if (globData[i].isocode != "OWID_WRL") {
                var anzahl = Number.parseInt(globData[i].totalcases);

                if (anzahl == 0) {
                    document.getElementById(globData[i].isocode).style.fill =
                        "hsl(35,100%,90%)";
                } else if (anzahl > 0 && anzahl <= 10) {
                    document.getElementById(globData[i].isocode).style.fill =
                        "hsl(30,100%,85%)";
                } else if (anzahl > 1 && anzahl <= 100) {
                    document.getElementById(globData[i].isocode).style.fill =
                        "hsl(25,100%,80%)";
                } else if (anzahl > 100 && anzahl <= 1000) {
                    document.getElementById(globData[i].isocode).style.fill =
                        "hsl(20,100%,75%)";
                } else if (anzahl > 1000 && anzahl <= 10000) {
                    document.getElementById(globData[i].isocode).style.fill =
                        "hsl(15,100%,70%)";
                } else if (anzahl > 10000 && anzahl <= 100000) {
                    document.getElementById(globData[i].isocode).style.fill =
                        "hsl(10,100%,65%)";
                } else if (anzahl > 100000 && anzahl <= 1000000) {
                    document.getElementById(globData[i].isocode).style.fill =
                        "hsl(5,100%,60%)";
                } else {
                    document.getElementById(globData[i].isocode).style.fill =
                        "hsl(0,100%,55%)";
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
    for (var i = 1; i <= 182; i++) {
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
    update();
}

function auffüllen(val) {
    let valString = val + "";
    if (valString.length < 2) {
        return "0" + valString;
    } else {
        return valString;
    }
}

function map(n, start1, stop1, start2, stop2) {
    const newval =
        ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
    return newval;
}
