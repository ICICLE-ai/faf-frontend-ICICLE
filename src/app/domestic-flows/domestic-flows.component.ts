import { Component, OnInit, ViewChild, ElementRef,AfterViewChecked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { LeftMenuComponent } from '../left-menu/left-menu.component';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ApiService } from '../api.service';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

Chart.register(...registerables);


@Component({
  selector: 'app-domestic-flows',
  standalone: true,
  imports: [CommonModule, FormsModule,LeftMenuComponent,HttpClientModule, RouterModule],  // Add CommonModule to imports
  templateUrl: './domestic-flows.component.html',
  styleUrls: ['./domestic-flows.component.css'],
  animations: [
    trigger('progressAnimation', [
      state('start', style({
        width: '0%'
      })),
      state('end', style({
        width: '{{progress}}%'
      }), { params: { progress: 0 } }),
      transition('start => end', [
        animate('2s ease-out')
      ]),
    ])
  ]
})
export class DomesticFlowsComponent implements OnInit  {
  selectedTab: number = 1;
  
  years: number[] = [];
  startYear: number | null = null;
  endYear: number | null = null;
  // endYear!: number;
  domesticMode: any[] = [];
  commodity: any[] = [];
  domesticDestinations: any[] = [];
  domesticOrigins: any[] = [];
  traspotationModeDetails: any = {};
  percentageDetails: any = {};
  barChartDetails: any[] = [];
  truck!: number;
  rail!: number;
  water!: number;
  air!: number;
  multiple!: number;
  pipeline!: number;
  other!: number;
  yearsCount!: number;
  stateImportPercentage!: string;
  stateExportPercentage!: string;
  pieChartTotalImportValue!:number;
  pieChartTotalExportValue!:number;
  isError: boolean = false;
  isDateError: boolean = false;
  loading = false;

  isRunClicked: boolean = false;

  constructor(private apiService: ApiService) {
    const currentYear = new Date().getFullYear();
    // const startRange = currentYear -10; // Starting year
    // this.years = Array.from({ length: (currentYear + 10) - startRange + 1 }, (_, i) => startRange + i);

  }
  selectTab(tabNumber: number): void {
    this.selectedTab = tabNumber;
    if ((this.selectedTab === 1) || (this.selectedTab === 3) ) {
      setTimeout(() => {
        this.createChart();
        this.animateProgressBars();
      }, 2);
    }
 console.log("tabwww",this.selectedTab)
    if (this.selectedTab === 3 ) {
      setTimeout(() => {
        this.createPieChart(); 
      }, 2);
    }
  }

  selectedFlowType: string = '';
  selectedDomesticOrigin: string = '';
  selectedDomesticMode: string = '';
  selectedDomesticDestination: string = '';
  selectedForeignDestination: string = '';
  selectedCommodity: string = '';
  selectPieChartState: string='Iowa';
  selectPieChartYear!:number;
  // startYear1: string = '';
  // endYear1: string = '';

  chart: any;
  pieChart: any; 

  @ViewChild('pieChartCanvas') pieChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;



  ngOnInit(): void {
    setTimeout(() => {
      this.createPieChart();  
    }, 0);
    this.loadDomesticFlowTabDetails();
    this.animateProgressBars();
    this.loadTranspotationModeDetails();
    this.loadBarChartDetails();
    const currentYear = new Date().getFullYear()-7; 
    this.selectPieChartYear = currentYear;
    this.loadImportExportStateDetails();
  }

  createChart(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  
    if (this.chartCanvas && this.chartCanvas.nativeElement) {
      const canvas = this.chartCanvas.nativeElement;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const years = this.barChartDetails.map(item => item.year.toString()); 
        const values = this.barChartDetails.map(item => parseFloat(item.value)); 
  
        this.chart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: years, 
            datasets: [{
              label: 'Total Domestic Import/Export (in million tons)', 
              data: values, 
              backgroundColor: 'rgb(78, 148, 183 , 0.6)', 
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true, 
                text: `Total Domestic Import/Export Over the Last ${this.yearsCount} Years`, 
                font: {
                  size: 18, 
                  family: 'Arial, sans-serif', 
                  weight: 'bold' 
                },
                color: '#333',
                padding: {
                  top: 20,
                  bottom: 10
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Amount (in million tons)', 
                  font: {
                    size: 14
                  }
                }
              },
              x: {
                title: {
                  display: true,
                  text: 'Years', 
                  font: {
                    size: 14
                  }
                }
              }
            }
          }
        });
      } else {
        console.error('Failed to get canvas 2D context');
      }
    } else {
      console.error('Canvas element not found');
    }
  }
  

  progressValues = {
    truck: 0,
    air: 0,
    water: 0,
    rail: 0,
    multipleModes: 0,  
    pipeline : 0, 
    otherUnknown: 0    
  };

  getProgressBarStyle(progress: number) {
    const percentage = (progress / 100) * 360; 
    return `conic-gradient(#29962d ${percentage}deg, #e0e0e0 ${percentage}deg)`; 
  }
  

  updateChartData(): void {
    if (this.chart) {
      const newData = this.getChartDataForFlowType(this.selectedFlowType);
      this.chart.data.datasets[0].data = newData;
      this.chart.update();
    }
  }

  getChartDataForFlowType(flowType: string): number[] {
    switch (flowType) {
      case 'Type 1':
        return [10, 20, 30, 40, 50];
      case 'Type 2':
        return [15, 25, 35, 45, 55];
      case 'Type 3':
        return [20, 30, 40, 50, 60];
      default:
        return [0, 0, 0, 0, 0];
    }
  }

  onRun(): void {
    if (!this.startYear || !this.selectedDomesticOrigin || !this.endYear) {
      this.isError = true;
      setTimeout(() => {
        this.isError = false;
      }, 4000); 
      return;  
    }
    if(this.startYear > this.endYear){
      this.isDateError = true;
      setTimeout(() => {
        this.isDateError = false;
      }, 4000); 
      return;  

    }

    this.isError = false; 
    this.sendRequest()
    this.isRunClicked = !this.isRunClicked;
  }
  updateYearRange() {
    if(this.startYear && this.endYear)
    if (this.startYear > this.endYear) {
      alert('Start year must be less than or equal to end year.');
    } else {
      console.log('Selected Year Range:', this.startYear, this.endYear);
    }
  }

  isAnimating = true; 

  animateProgressBars() {
    setTimeout(() => {
      this.setProgress('truck', this.percentageDetails.Truck);  
      this.setProgress('air', this.percentageDetails['Air (include truck-air)']); 
      this.setProgress('water', this.percentageDetails.Water); 
      this.setProgress('rail', this.percentageDetails.Rail); 
      this.setProgress('multipleModes', this.percentageDetails['Multiple modes & mail']); 
      this.setProgress('pipeline', this.percentageDetails.Pipeline); 
      this.setProgress('otherUnknown', this.percentageDetails['Other and unknown']); 
    }, 500); 
  }

  setProgress(transport: keyof typeof this.progressValues, value: number): void {
    const step = 1;  
    let currentValue = 0;
    const interval = setInterval(() => {
      if (currentValue < value) {
        currentValue += step;
        this.progressValues[transport] = currentValue;
      } else {
        clearInterval(interval);
      }
    }, 20); 
  }
  

  hovering: string | null = null;

  onHover(transport: string): void {
    this.hovering = transport;
  }
  onLeave(): void {
    this.hovering = null;
  }

  createPieChart(): void {
    if (this.pieChart) {
      this.pieChart.destroy();
    }
  
    if (this.pieChartCanvas && this.pieChartCanvas.nativeElement) {
      const canvas = this.pieChartCanvas.nativeElement;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        this.pieChart = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: ['Import', 'Export'],
            datasets: [{
              data: [this.stateImportPercentage, this.stateExportPercentage],
              backgroundColor: ['#507295', '#0b8e74'], 
              borderColor: ['#6ea7c4', '#085e4d'],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: `Import vs Export for ${this.selectPieChartState} state in ${this.selectPieChartYear} Year`,
                font: {
                  size: 18,
                  family: 'Arial, sans-serif',
                  weight: 'bold'
                },
                color: '#333'
              },
              tooltip: {
                callbacks: {
                  label: (tooltipItem) => {
                    const percentage = tooltipItem.dataIndex === 0 
                      ? this.stateImportPercentage 
                      : this.stateExportPercentage;
                    const label =  (tooltipItem.dataIndex === 0 ? `Total Import ${this.pieChartTotalImportValue} Tones` 
                      : `Total Export ${this.pieChartTotalExportValue} Tones`);
                    return `${label}: (${percentage})%`;
                  }
                }
              }
            }
          }
        });
      }
    }
  }
  
  
  loadDomesticFlowTabDetails() {
    this.apiService.loadDomesticFlowTabDetails().subscribe({
      next: (response) => {
        this.domesticDestinations = response.domestic_destination;
        this.domesticOrigins = response.domestic_origin;
        this.domesticMode = response.domestic_mode;
        this.commodity = response.commodity;
        this.years = response.state_year;
                // Initialize selectedDomesticDestination to the first element of the array
                // if (this.years && this.years.length > 0) {
                //   this.startYear = this.years[0];
                //   this.endYear = this.years[1];
                // }
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
  }

  loadTranspotationModeDetails() {
    const payload = {
      flow: 'domestic',
      timeframe: [2023],

    };
    this.apiService.loadTranspotationModeDetails(payload).subscribe({
      next: (response) => {
        this.traspotationModeDetails = response;
        const totalValue = (Object.values(this.traspotationModeDetails) as number[]).reduce(
          (acc, value) => acc + value,
          0
        );
       this.percentageDetails = Object.keys(this.traspotationModeDetails).reduce((acc, key) => {
        const value = this.traspotationModeDetails[key];
        const percentage = (value / totalValue) * 100;
        acc[key] = parseFloat(percentage.toFixed(2));
        return acc;
      }, {} as { [key: string]: number });

      console.log('Percentage Details:', this.percentageDetails);
      this.animateProgressBars();
      
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
  }

  onStateChange(event:Event){
    const selectedState = (event.target as HTMLSelectElement).value;
    console.log('Selected State:', selectedState);
    this.selectPieChartState = selectedState;
    this.loadImportExportStateDetails();
  }
  
  onYearChange(event:Event){
    const selectedYear = Number((event.target as HTMLSelectElement).value);
    console.log('Selected State:', selectedYear);
    this.selectPieChartYear = selectedYear;
    this.loadImportExportStateDetails();
  }

  loadImportExportStateDetails() {

    const payload = {
      origin: this.selectPieChartState,
      timeframe: [this.selectPieChartYear],
      commodity: "",
      destination: "",
      transpotation: "",
      flow: 'domestic',
    };
  
    this.loading = true;
    this.apiService.loadImportExportStateDetails(payload).subscribe({
      next: (response) => {
        const dataForCurrentYear = response[this.selectPieChartYear];
        if (dataForCurrentYear) {
          const imports = dataForCurrentYear.Imports;
          const exports = dataForCurrentYear.Exports;
          this.pieChartTotalImportValue = imports.toFixed(2);;
          this.pieChartTotalExportValue = exports.toFixed(2);;

          const total = imports + exports;
  
          this.stateImportPercentage = ((imports / total) * 100).toFixed(2);
          this.stateExportPercentage = ((exports / total) * 100).toFixed(2);
          this.createPieChart();
          this.loading = false;
        } else {
          this.loading = false;
          console.warn(`No data found for ${this.selectPieChartYear}`);
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Error:', error);
      },
    });
  }

  loadBarChartDetails() {
    const payload = {
      flow: 'domestic',
      timeframe: [2019, 2023],

    };
    this.apiService.loadBarChartDetails(payload).subscribe({
      next: (response) => {
        this.barChartDetails = Object.entries(response).map(([year, value]) => ({
          year: Number(year.replace(/'/g, '')), 
          value: Array.isArray(value) ? value[0].toFixed(2) : null,
        }));
        console.log('Formatted Data:', this.barChartDetails);
       this.yearsCount = this.barChartDetails.length;
       this.createChart(); 

      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
  }
  
  sendRequest() {
    if(this.startYear && this.endYear){
    const payload = {
      origin: this.selectedDomesticOrigin,
      timeframe: [this.startYear, this.endYear],
      commodity: this.selectedCommodity,
      destination: this.selectedDomesticDestination,
      transpotation: this.selectedDomesticMode,
      flow: 'domestic',
    };
    this.loading = true;

    this.apiService.postDomesticFlow(payload).subscribe({
      next: (response: Blob) => {
        const link = document.createElement('a');
        const url = window.URL.createObjectURL(response);
        link.href = url;
        link.download = 'domestic_imports.csv'; 
        link.click(); 
        window.URL.revokeObjectURL(url); 
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        console.error('File download error:', error);
      },
    });
  }
  }
  
}

