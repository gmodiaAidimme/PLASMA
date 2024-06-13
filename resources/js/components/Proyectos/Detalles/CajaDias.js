import React, { useEffect } from "react";
import { Caja } from "../../generales";
import { Bar } from "react-chartjs-2";


function CajaDias({ dias }) {

    const processDias = () => {
        let labels = dias.map(dia => dia.fecha);
        labels = [...new Set(labels)];
        let datasets = dias.map(dia => {
            let index = labels.findIndex((label) => label === dia.fecha);
            let data = new Array(labels.length).fill(0);
            data[index] = dia.horas;
            return {
                label: dia.orden,
                data: data,
                backgroundColor: '#' + Math.floor(Math.random() * 16777215).toString(16)
            }
        });

        return {
            labels: labels,
            datasets: datasets
        }
    }

    const options = {
        plugins: {
            title: {
                display: false,
            },
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true,
            },
        },
    };
    
    return (
        <Caja titulo="Dias">
            <Bar data={processDias()} options={options} />
        </Caja>
    )
}

export default CajaDias;