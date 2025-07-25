 // Data siswa
const siswa = [
    { id: 1, nama: "ZIDAN" },
    { id: 2, nama: "ALVIN" },
    { id: 3, nama: "ALYA" },
    { id: 4, nama: "REZA" },
    { id: 5, nama: "Sayang🤞🏻" },
    { id: 6, nama: "ANIS" },
    { id: 7, nama: "AZKA" },
    { id: 8, nama: "ARYA" },
    { id: 9, nama: "REGAN" },
    { id: 10, nama: "AZRIEL" },
    { id: 11, nama: "BINTANG" },
    { id: 12, nama: "DIMAS" },
    { id: 13, nama: "EVAN" },
    { id: 14, nama: "EGA" },
    { id: 15, nama: "GILANG" },
    { id: 16, nama: "BILA" },
    { id: 17, nama: "ALAM" },
    { id: 18, nama: "ABI" },
    { id: 19, nama: "DAVIN" },
    { id: 20, nama: "MUMTAZ" },
    { id: 21, nama: "VENO" },
    { id: 22, nama: "YUSUF" },
    { id: 23, nama: "NAILA" },
    { id: 24, nama: "FAREL" },
    { id: 25, nama: "NAZA" },
    { id: 26, nama: "RAMA" },
    { id: 27, nama: "NICO" },
    { id: 28, nama: "RAFFA" },
    { id: 29, nama: "RAFIF" },
    { id: 30, nama: "REPI" },
    { id: 31, nama: "DAVID" },
    { id: 32, nama: "LILI" },
    { id: 33, nama: "SHOLEH" },
    { id: 34, nama: "FAZA" },
    { id: 35, nama: "DHANA" },
    { id: 36, nama: "FIRDAUS" }
];

// Harga pembayaran
const hargaJurnal = 5000;
const hargaBet = 10000;
const totalPerSiswa = hargaJurnal + hargaBet;

// Key untuk localStorage
const STORAGE_KEY = 'sistem_pembayaran_kelas_data';

// Status pembayaran dengan localStorage
let pembayaran = {};

// Fungsi untuk menyimpan data ke localStorage
function saveToLocalStorage() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(pembayaran));
        console.log('Data berhasil disimpan ke localStorage');
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        // Fallback jika localStorage penuh atau error
        alert('Gagal menyimpan data. Storage mungkin penuh.');
    }
}

// Fungsi untuk memuat data dari localStorage
function loadFromLocalStorage() {
    try {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            console.log('Data berhasil dimuat dari localStorage');
            return parsedData;
        }
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        // Jika ada error parsing, reset localStorage
        localStorage.removeItem(STORAGE_KEY);
    }
    return null;
}

// Fungsi untuk menginisialisasi data pembayaran
function initializePembayaran() {
    // Coba muat dari localStorage terlebih dahulu
    const savedData = loadFromLocalStorage();
    
    if (savedData) {
        pembayaran = savedData;
        
        // Pastikan semua siswa ada dalam data yang dimuat
        // Jika ada siswa baru yang ditambahkan, inisialisasi dengan false
        siswa.forEach(s => {
            if (!pembayaran[s.id]) {
                pembayaran[s.id] = { jurnal: false, bet: false };
            }
        });
    } else {
        // Jika tidak ada data tersimpan, inisialisasi default
        siswa.forEach(s => {
            pembayaran[s.id] = { jurnal: false, bet: false };
        });
    }
}

// Fungsi untuk reset semua data (opsional)
function resetAllData() {
    if (confirm('Apakah Anda yakin ingin menghapus semua data pembayaran?')) {
        localStorage.removeItem(STORAGE_KEY);
        siswa.forEach(s => {
            pembayaran[s.id] = { jurnal: false, bet: false };
        });
        updateTable();
        updateSummary();
        updateCharts();
        alert('Semua data telah dihapus!');
    }
}

// Fungsi untuk export data ke JSON file (bonus feature)
function exportData() {
    const dataToExport = {
        timestamp: new Date().toISOString(),
        siswa: siswa,
        pembayaran: pembayaran,
        summary: {
            totalTerkumpul: calculateTotalTerkumpul(),
            totalTunggakan: calculateTotalTunggakan()
        }
    };
    
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `pembayaran_kelas_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
}

// Fungsi helper untuk menghitung total
function calculateTotalTerkumpul() {
    let total = 0;
    siswa.forEach(s => {
        const bayarJurnal = pembayaran[s.id].jurnal ? hargaJurnal : 0;
        const bayarBet = pembayaran[s.id].bet ? hargaBet : 0;
        total += bayarJurnal + bayarBet;
    });
    return total;
}

function calculateTotalTunggakan() {
    let total = 0;
    siswa.forEach(s => {
        const bayarJurnal = pembayaran[s.id].jurnal ? hargaJurnal : 0;
        const bayarBet = pembayaran[s.id].bet ? hargaBet : 0;
        const totalBayar = bayarJurnal + bayarBet;
        const tunggakan = totalPerSiswa - totalBayar;
        total += tunggakan;
    });
    return total;
}

// Fungsi untuk memformat angka ke format rupiah
function formatRupiah(angka) {
    return "Rp " + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Fungsi untuk mengupdate tabel
function updateTable() {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';
    
    siswa.forEach(s => {
        const row = document.createElement('tr');
        
        // Hitung total bayar dan tunggakan
        const bayarJurnal = pembayaran[s.id].jurnal ? hargaJurnal : 0;
        const bayarBet = pembayaran[s.id].bet ? hargaBet : 0;
        const totalBayar = bayarJurnal + bayarBet;
        const tunggakan = totalPerSiswa - totalBayar;
        const status = tunggakan === 0 ? 'Lunas' : 'Belum Lunas';
        
        row.innerHTML = `
            <td class="py-3 px-4">${s.id}</td>
            <td class="py-3 px-4 font-medium">${s.nama}</td>
            <td class="py-3 px-4 text-center">
                <label class="checkbox-container">
                    <input type="checkbox" class="sr-only" data-siswa="${s.id}" data-jenis="jurnal" ${pembayaran[s.id].jurnal ? 'checked' : ''}>
                    <div class="custom-checkbox"></div>
                </label>
            </td>
            <td class="py-3 px-4 text-center">
                <label class="checkbox-container">
                    <input type="checkbox" class="sr-only" data-siswa="${s.id}" data-jenis="bet" ${pembayaran[s.id].bet ? 'checked' : ''}>
                    <div class="custom-checkbox"></div>
                </label>
            </td>
            <td class="py-3 px-4 text-right font-medium ${totalBayar > 0 ? 'text-green-400' : ''}">${formatRupiah(totalBayar)}</td>
            <td class="py-3 px-4 text-right font-medium ${tunggakan > 0 ? 'text-red-400' : ''}">${formatRupiah(tunggakan)}</td>
            <td class="py-3 px-4 text-center">
                <span class="status-badge ${status === 'Lunas' ? 'status-lunas' : 'status-belum'}">${status}</span>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Tambahkan event listener untuk checkbox
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const siswaId = parseInt(this.dataset.siswa);
            const jenis = this.dataset.jenis;
            pembayaran[siswaId][jenis] = this.checked;
            
            // Simpan ke localStorage setiap kali ada perubahan
            saveToLocalStorage();
            
            updateTable();
            updateSummary();
            updateCharts();
        });
    });
    
    updateSummary();
    updateCharts();
}

// Fungsi untuk mengupdate ringkasan
function updateSummary() {
    const totalTerkumpul = calculateTotalTerkumpul();
    const totalTunggakan = calculateTotalTunggakan();
    
    document.getElementById('totalTerkumpul').textContent = formatRupiah(totalTerkumpul);
    document.getElementById('totalTunggakan').textContent = formatRupiah(totalTunggakan);
}

// Fungsi untuk mengupdate chart
function updateCharts() {
    // Data untuk chart
    let jurnalBayar = 0;
    let jurnalBelum = 0;
    let betBayar = 0;
    let betBelum = 0;
    let siswaLunas = 0;
    let siswaBelumLunas = 0;
    
    siswa.forEach(s => {
        if (pembayaran[s.id].jurnal) jurnalBayar++;
        else jurnalBelum++;
        
        if (pembayaran[s.id].bet) betBayar++;
        else betBelum++;
        
        const bayarJurnal = pembayaran[s.id].jurnal ? hargaJurnal : 0;
        const bayarBet = pembayaran[s.id].bet ? hargaBet : 0;
        const totalBayar = bayarJurnal + bayarBet;
        const tunggakan = totalPerSiswa - totalBayar;
        
        if (tunggakan === 0) siswaLunas++;
        else siswaBelumLunas++;
    });
    
    // Check if chart elements exist before creating charts
    const pieChartElement = document.getElementById('pieChart');
    const barChartElement = document.getElementById('barChart');
    
    if (pieChartElement) {
        // Pie Chart
        if (window.pieChart) window.pieChart.destroy();
        const pieCtx = pieChartElement.getContext('2d');
        window.pieChart = new Chart(pieCtx, {
            type: 'doughnut',
            data: {
                labels: ['Lunas', 'Belum Lunas'],
                datasets: [{
                    data: [siswaLunas, siswaBelumLunas],
                    backgroundColor: [
                        'rgba(16, 185, 129, 0.7)',
                        'rgba(239, 68, 68, 0.7)'
                    ],
                    borderColor: [
                        'rgba(16, 185, 129, 1)',
                        'rgba(239, 68, 68, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: 'white',
                            font: {
                                family: 'Poppins'
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${value} siswa (${percentage}%)`;
                            }
                        }
                    }
                },
                cutout: '70%',
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            }
        });
    }
    
    if (barChartElement) {
        // Bar Chart
        if (window.barChart) window.barChart.destroy();
        const barCtx = barChartElement.getContext('2d');
        window.barChart = new Chart(barCtx, {
            type: 'bar',
            data: {
                labels: ['Jurnal (Rp 5.000)', 'BET Kelas (Rp 10.000)'],
                datasets: [
                    {
                        label: 'Sudah Bayar',
                        data: [jurnalBayar, betBayar],
                        backgroundColor: 'rgba(79, 70, 229, 0.7)',
                        borderColor: 'rgba(79, 70, 229, 1)',
                        borderWidth: 1,
                        borderRadius: 6
                    },
                    {
                        label: 'Belum Bayar',
                        data: [jurnalBelum, betBelum],
                        backgroundColor: 'rgba(239, 68, 68, 0.7)',
                        borderColor: 'rgba(239, 68, 68, 1)',
                        borderWidth: 1,
                        borderRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)',
                            font: {
                                family: 'Poppins'
                            }
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)',
                            font: {
                                family: 'Poppins'
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: 'white',
                            font: {
                                family: 'Poppins'
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.dataset.label || '';
                                const value = context.raw || 0;
                                return `${label}: ${value} siswa`;
                            }
                        }
                    }
                },
                animation: {
                    delay: function(context) {
                        return context.dataIndex * 100;
                    }
                }
            }
        });
    }
}

// Fungsi untuk menambahkan tombol kontrol (opsional)
function addControlButtons() {
    const header = document.querySelector('.glass');
    if (header) {
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'flex gap-2 mt-4';
        buttonContainer.innerHTML = `
            <button onclick="resetAllData()" class="glass px-4 py-2 text-sm rounded-lg hover:bg-red-500/20 transition-colors text-red-300">
                Reset Data
            </button>
            <button onclick="exportData()" class="glass px-4 py-2 text-sm rounded-lg hover:bg-blue-500/20 transition-colors text-blue-300">
                Export Data
            </button>
        `;
        header.appendChild(buttonContainer);
    }
}

// Event listener untuk auto-save sebelum page unload
window.addEventListener('beforeunload', function() {
    saveToLocalStorage();
});

// Inisialisasi aplikasi
document.addEventListener('DOMContentLoaded', function() {
    // Inisialisasi data pembayaran dari localStorage
    initializePembayaran();
    
    // Update tabel dengan data yang sudah dimuat
    updateTable();
    
    // Tambahkan tombol kontrol (opsional)
    addControlButtons();
    
    // Tambahkan efek hover pada baris tabel
    const tableRows = document.querySelectorAll('tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
    
    // Auto-save setiap 30 detik (backup)
    setInterval(saveToLocalStorage, 30000);
    
    console.log('Sistem Pembayaran Kelas telah dimuat dengan localStorage support');
});

// Expose functions to global scope untuk debugging (opsional)
window.pembayaranSystem = {
    reset: resetAllData,
    export: exportData,
    save: saveToLocalStorage,
    load: loadFromLocalStorage,
    getData: () => pembayaran
};