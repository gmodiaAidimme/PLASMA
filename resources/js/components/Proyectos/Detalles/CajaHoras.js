import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Caja } from '../../generales';
import axios from 'axios';
import { useParams } from 'react-router-dom';


function CajaHoras({ horasEstimadas, horasTrabajadas}) {

    //shows a horizontal bar chart with the estimated hours and the hours worked
    const data = {
        labels: ['Horas estimadas', 'Horas trabajadas'],
        datasets: [
            {
                label: 'Horas',
                data: [horasEstimadas, horasTrabajadas],
                backgroundColor: [
                    'rgba(12, 202, 241, 1)',
                    'rgba(40,167,69,1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        mantainAspectRatio: false,
        indexAxis: 'y',
        elements: {
            bar: {
                borderWidth: 2,
            },
        },
        responsive: true,
        plugins: {
            legend: {
                position: 'right',
            },
            title: {
                display: false,
            },
        },
    };

    return (
        <Caja titulo="Horas">
            <div className="row">
                <div className="col-md-12">
                    <Bar data={data} options={options} height={20} />
                </div>
            </div>
        </Caja>
    )
}

export default CajaHoras;