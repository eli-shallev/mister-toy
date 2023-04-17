import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, RadialLinearScale } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { toyService } from '../services/toy.service';
import { showErrorMsg } from '../services/event-bus.service';

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

export function DoughnutCharts() {
    const [inventoryByTypeData, SetInventoryByTypeData] = useState(null)
    const [PricesPerToyTypeData, SetPricesPerToyTypeData] = useState(null)

    useEffect(() => {
        ; (async () => {
            try {
                const { labelsByAmountMap, labelsByPriceMap } = await toyService.getDashboardData()
                SetInventoryByTypeData(getData(labelsByAmountMap, 'Inventory by type'))
                SetPricesPerToyTypeData(getData(labelsByPriceMap, 'Prices per toy type'))
            } catch (error) {
                showErrorMsg('Cannot load data')
            }
        })()
    }, [])

    function getData(mainObj, title) {
        return {
            labels: Object.keys(mainObj),
            datasets: [
                {
                    label: title,
                    data: Object.values(mainObj),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(255, 206, 86, 0.5)',
                        'rgba(75, 192, 192, 0.5)',
                        'rgba(153, 102, 255, 0.5)',
                        'rgba(255, 159, 64, 0.5)',
                        'rgba(34, 139, 34, 0.5)',
                        'rgba(165, 42, 42, 0.5)',
                        'rgba(255, 0, 255, 0.5)',
                        'rgba(25, 25, 112, 0.5)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(34, 139, 34, 1)',
                        'rgba(165, 42, 42, 1)',
                        'rgba(255, 0, 255, 1)',
                        'rgba(25, 25, 112, 1)'
                    ],
                    borderWidth: 2,
                },
            ],
        }
    }

    return (
        <section className="doughnut-charts">
            <div className='doughnut-item'>
                <h2>Inventory by type</h2>
                {inventoryByTypeData && <Doughnut data={inventoryByTypeData} />}
            </div>
            <div className='doughnut-item'>
                <h2>Prices per toy type</h2>
                {PricesPerToyTypeData && <Doughnut data={PricesPerToyTypeData} />}
            </div>
        </section>
    )
}
