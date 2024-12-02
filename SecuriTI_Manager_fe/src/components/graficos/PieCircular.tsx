import React from 'react';
import {
    AccumulationChartComponent,
    AccumulationSeriesCollectionDirective,
    AccumulationSeriesDirective,
    Inject,
    AccumulationLegend,
    PieSeries,
    AccumulationDataLabel,
    AccumulationTooltip
} from '@syncfusion/ej2-react-charts';
import { IAccLoadedEventArgs, AccumulationTheme } from '@syncfusion/ej2-charts';
import { Browser } from '@syncfusion/ej2-base';

// Definir la interfaz para las props
interface PieRadiusProps {
    id?: string;  // Agregar el id como prop opcional
    data: { x: string; y: number; tooltip?: string; r?: string }[];  // Conjunto de datos
    title?: string;  // Título opcional
    tooltipFormat?: string;  // Formato del tooltip opcional
}

// Componente reutilizable PieRadius
const PieRadius: React.FC<PieRadiusProps> = ({ id = 'pie-chart', data, title = 'Gráfico Circular', tooltipFormat = '<b>${point.x}</b><br/>Valor: <b>${point.y}</b>' }) => {

    const load = (args: IAccLoadedEventArgs): void => {
        let selectedTheme: string = location.hash.split('/')[1];
        selectedTheme = selectedTheme ? selectedTheme : 'Fluent2';
        args.accumulation.theme = (selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)).replace(/-dark/i, "Dark").replace(/contrast/i, 'Contrast').replace(/-highContrast/i, 'HighContrast') as AccumulationTheme;
    };

    return (
        <div className='control-pane'>
            <div className='control-section'>
                <AccumulationChartComponent
                    id={id}  // Asignar id único
                    height="250px"
                    legendSettings={{ visible: true, reverse: true }}
                    enableSmartLabels={true}
                    title={title}
                    enableBorderOnMouseMove={false}
                    enableAnimation={true}
                    load={load.bind(this)}
                    tooltip={{ enable: true, format: tooltipFormat }}
                >
                    <Inject services={[AccumulationLegend, PieSeries, AccumulationDataLabel, AccumulationTooltip]} />
                    <AccumulationSeriesCollectionDirective>
                        <AccumulationSeriesDirective
                            dataSource={data}
                            xName='x'
                            yName='y'
                            innerRadius='20%'
                            tooltipMappingName='tooltip'
                            dataLabel={{
                                visible: true,
                                position: Browser.isDevice ? 'Inside' : 'Outside',
                                name: 'x',
                                enableRotation: true,
                                font: { fontWeight: '600' },
                                connectorStyle: { length: '20px', type: 'Curve' }
                            }}
                            radius='r'
                        />
                    </AccumulationSeriesCollectionDirective>
                </AccumulationChartComponent>
            </div>
        </div>
    );
};

export default PieRadius;
