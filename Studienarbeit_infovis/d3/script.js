var slider = "31.12.2019";
var globData;
let file = "corona_dataset.csv";
var totalcases_max = 10000.0;
var totalcases_min = Number.MAX_VALUE;

d3.csv(file).then(function (data) {
    globData = data;
    for (var i = 0; i < data.length; i++) {
        var total = data[i].totalcases;

        if (total < totalcases_min) totalcases_min = total;
        if (total > totalcases_max) totalcases_max = total;
    }

    console.log(totalcases_max);
    //d3.selectAll("path").each(function (d, i) {
    //    console.log(this.id);
    //});
});

function minmaxrausfinden() {}

function update() {
    for (var i = 0; i < globData.length; i++) {
        if (slider == globData[i].date) {
            if (globData[i].isocode != "OWID_WRL") {
                var color = globData[i].totalcases;
                var hue = map(color, totalcases_min, totalcases_max, 0, 100);

                document.getElementById(globData[i].isocode).style.fill =
                    "hsv(240," + hue + "%,100%)";
            }
        }
    }
}

function setPaar() {
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
    var newval = ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
    return newval;
}
