let cnvs;
let chart;

let xSelect;
let ySelect;

function setup() {
    cnvs = createCanvas(windowWidth - 50, windowHeight - 50);
    
    let centerX = (windowWidth - width) / 2;
    let centerY = (windowHeight - height) / 2;

    cnvs.position(centerX, centerY);

    let datapoints = [];
    for(let i = 0; i < 50; i++) {
        let point = new Datapoint();
        point.addAttr("x", i * 20);
        point.addAttr("y", (i * 10) + random(50));

        datapoints.push(point);
    }

    chart = new Chart(datapoints);
    chart.setXAxis("x");
    chart.setYAxis("y");

    xSelect = createSelect();
    xSelect.option("x");
    xSelect.option("y");
    xSelect.changed(xAxisChanged);

    ySelect = createSelect();
    ySelect.option("y");
    ySelect.option("x");
    ySelect.changed(yAxisChanged);
}

function draw() {
    cnvs.resize(windowWidth - 50, windowHeight - 50);
    
    let centerX = (windowWidth - width) / 2;
    let centerY = (windowHeight - height) / 2;

    cnvs.position(centerX, centerY);

    background('#9C7451');

    chart.render();
}

function xAxisChanged() {
    chart.setXAxis(xSelect.value());
}

function yAxisChanged() {
    chart.setYAxis(ySelect.value());
}

//Objects
class Datapoint {
    constructor() {
        this.attributes = {};
    }

    addAttr(attr, value) {
        this.attributes[attr] = value;
    }

    getAttr(attr) {
        return this.attributes[attr];
    }

    static sortPointsByAttr(points, attr) {
        //Bubble sort for testing
        let sortedPoints = JSON.parse(JSON.stringify(points));

        for(let i = 0; i < sortedPoints.length; i++) {
            for(let j = 0; j < sortedPoints.length - i - 1; j++) {
                let thisPoint = sortedPoints[j];
                let nextPoint = sortedPoints[j + 1];

                if(thisPoint[attr] > nextPoint[attr]) {
                    sortedPoints[j] = nextPoint;
                    sortedPoints[j + 1] = thisPoint;
                }
            }
        }

        return sortedPoints;
    }
}

class Chart {
    constructor(datapoints) {
        this.datapoints = datapoints;

        this.xAxis = "";
        this.yAxis = "";
    }

    addPoint(datapoint) {
        this.datapoints.push(datapoint);
    }

    setXAxis(attr) {
        this.xAxis = attr;
    }

    setYAxis(attr) {
        this.yAxis = attr;
    }

    render() {
        stroke('#462A13');

        beginShape();

        for(let datapoint of this.datapoints) {
            strokeWeight(10);

            let debugX = datapoint.getAttr(this.xAxis);
            let debugY = datapoint.getAttr(this.yAxis);

            vertex(debugX, -debugY + height);
            point(debugX, -debugY + height);
        }

        noFill();
        //stroke('#462A13');
        strokeWeight(2);

        endShape();
    }
}