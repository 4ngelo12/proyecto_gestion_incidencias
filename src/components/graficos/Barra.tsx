import React, { useEffect, useState } from "react";
import { ChartComponent, SeriesCollectionDirective, SeriesDirective, Inject, Legend, Category, ColumnSeries, DataLabel, Highlight } from '@syncfusion/ej2-react-charts';

interface SeriesData {
    dataSource: { x: string; y: number; toolTipMappingName?: string }[];
    name: string;
}

// Definir las props que aceptará el componente
interface ColumnChartProps {
    id?: string;  // Prop para un ID dinámico
    title?: string;
    xAxisTitle?: string;
    yAxisTitle?: string;
    yAxisMax?: number;
    yAxisInterval?: number;
    seriesData: SeriesData[];  // Series de datos dinámicas
}

// Función para generar un ID válido
const generateValidId = () => `chart-${Math.random().toString(36).substr(2, 9)}`;

const SAMPLE_CSS = `
    .control-fluid {
        padding: 0px !important;
    }`;

const ColumnChart: React.FC<ColumnChartProps> = ({
    id = generateValidId(),  // Generar un id único por defecto
    title = 'Gráfico de Columnas',
    xAxisTitle = 'Categorías',
    yAxisTitle = 'Valores',
    yAxisMax = 30,  // Máximo del eje Y por defecto
    yAxisInterval = 2,  // Intervalo del eje Y por defecto
    seriesData
}) => {

    const [isLoaded, setIsLoaded] = useState(false);

    // Callback para el evento loaded del gráfico
    const loaded = (): void => {
        setIsLoaded(true);  // Marcar el gráfico como cargado
    };

    // Efecto para realizar acciones una vez que el gráfico ha sido cargado
    useEffect(() => {
        if (isLoaded) {
            setTimeout(() => {
                const chartElement = document.getElementById(id);
                if (chartElement) {
                    chartElement.setAttribute('title', '');  // Modificar atributos del gráfico o realizar otras acciones
                }
            }, 100);  // Añadir un pequeño retraso para asegurarse de que el DOM está completamente cargado
        }
    }, [isLoaded, id]);

    return (
        <div className='control-pane'>
            <style>{SAMPLE_CSS}</style>
            <div className='control-section'>
                <ChartComponent
                    id={id}
                    height="300px"
                    primaryXAxis={{
                        title: xAxisTitle,
                        valueType: 'Category',
                        interval: 1,
                    }}
                    primaryYAxis={{
                        title: yAxisTitle,
                        maximum: yAxisMax,
                        interval: yAxisInterval,
                    }}
                    chartArea={{ border: { width: 0 } }}
                    title={title}
                    loaded={loaded}
                    tooltip={{ enable: false }}
                    legendSettings={{
                        visible: true,
                        toggleVisibility: false, // Evitar que la leyenda alterne la visibilidad de las series
                    }}
                >
                    <Inject services={[ColumnSeries, Legend, Category, DataLabel, Highlight]} />
                    <SeriesCollectionDirective>
                        {seriesData.map((series, index) => (
                            <SeriesDirective
                                key={index}
                                dataSource={series.dataSource}
                                xName="x"
                                yName="y"
                                name={series.name}
                                type="Column"
                                columnSpacing={0}
                            />
                        ))}
                    </SeriesCollectionDirective>
                </ChartComponent>
            </div>
        </div>
    );
};

export default ColumnChart;
