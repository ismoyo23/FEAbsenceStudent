import React, { useState, useEffect } from 'react';
import axios from 'axios'
import QrReader from 'react-qr-reader'
import './App.css';
import Swal from 'sweetalert2'
import CartIcon from './image/download.png';
function App() {

  let [result, setResult] = useState('')
  let port = 'http://localhost:8000';


  let scanner = (data) => {
    if (data) {
      axios({
        method: 'GET',
        url: `${port}/seeUser/${data}`
      }).then((response) => {
        if (response.data[0] != null) {
          let setData = {
            'data': data,
            'majors': response.data[0].majors,
            'class': response.data[0].class,
            'letter': response.data[0].letter
          }
          validateQR(setData)
        } else {
          Swal.fire({
            title: 'Maaf',
            text: "Data tidak terdaftar",
            icon: 'error',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Yes'
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.reload()
            }
          })
        }
      })
    }
  }

  let process = (setData) => {
    axios({
      method: 'GET',
      url: `${port}/createAbsence/${setData.data}/${setData.majors}/${setData.class}/${setData.letter}`
    }).then((response) => {
      Swal.fire({
        title: 'success',
        text: "Absen berhasil",
        icon: 'success',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Yes'
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload()
        }
      })
    }).catch((error) => {
      console.log(error)
    })
  }

  let nip = () => {

    axios({
      method: 'GET',
      url: `${port}/seeUser/${result}`
    }).then((response) => {

      if (response.data[0] != null) {
        let setData = {
          'data': result,
          'majors': response.data[0].majors,
          'class': response.data[0].class,
          'letter': response.data[0].letter
        }
        validate(setData)
      } else {
        Swal.fire({
          title: 'Maaf',
          text: "Data tidak terdaftar",
          icon: 'error',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Yes'
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload()
          }
        })
      }
    })
  }

  let validateQR = (setData) => {
    axios({
      method: 'GET',
      url: `${port}/absenceGet/${setData.data}`
    }).then((response) => {
      if (response.data[0] == null) {
        process(setData)
      } else {
        if (response.data[0].nik != setData.data) {
          process(setData)
        } else {
          Swal.fire({
            title: 'Maaf',
            text: "Absen sudah absen",
            icon: 'error',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Yes'
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.reload()
            }
          })
        }
      }

    })
  }

  let validate = (setData) => {
    axios({
      method: 'GET',
      url: `${port}/absenceGet/${result}`
    }).then((response) => {
      if (response.data[0] == null) {
        process(setData)
      } else {
        if (response.data[0].nik != result) {
          process(result)
        } else {
          Swal.fire({
            title: 'Maaf',
            text: "Absen sudah absen",
            icon: 'error',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Yes'
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.reload()
            }
          })
        }
      }

    })
  }

  return (
    <div className="App">
      <div>

        {/* Modal */}
        <div className="modal fade" id="exampleModal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Absen</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <nav>
                  <div class="nav nav-tabs" id="nav-tab" role="tablist">
                    <a class="nav-item nav-link active" id="nav-home-tab" data-toggle="tab" href="#nav-home" role="tab" aria-controls="nav-home" aria-selected="true">QR</a>
                    <a class="nav-item nav-link" id="nav-profile-tab" data-toggle="tab" href="#nav-profile" role="tab" aria-controls="nav-profile" aria-selected="false">Nisn</a>

                  </div>
                </nav>
                <br />
                <div class="tab-content" id="nav-tabContent">
                  <div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab"><QrReader
                    delay={300}
                    onScan={scanner}
                    style={{ width: '100%' }}
                  /></div>
                  <div class="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
                    <div className="form-group">
                      <input onChange={(e) => setResult(e.target.value)} value={result} type="number" className="form-control" id="formGroupExampleInput2" placeholder="Input Nisn" />
                    </div>
                  </div>
                </div>

              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                <button onClick={nip} type="button" className="btn btn-primary">Absence</button>
              </div>
            </div>
          </div>
        </div>

        {/* ======= Header ======= */}
        <header id="header" className="fixed-top header-transparent">
          <div className="container-fluid">
            <div className="row justify-content-center">
              <div className="col-xl-11 d-flex align-items-center">
                <h1 className="logo mr-auto"><a href="index.html"><img src={CartIcon} style={{ width: 40, height: 90 }} /><span style={{ marginLeft: 9 }}>Absen Siswa SMKN 2 Trengale</span>k</a></h1>
                {/* Uncomment below if you prefer to use an image logo */}
                {/* <a href="index.html" class="logo mr-auto"><img src="assets/img/logo.png" alt="" class="img-fluid"></a>*/}

              </div>
            </div>
          </div>
        </header>{/* End Header */}
        {/* ======= Intro Section ======= */}
        <section id="intro">
          <div className="intro-container">
            <div id="introCarousel" className="carousel  slide carousel-fade" data-ride="carousel">
              <ol className="carousel-indicators" />
              <div className="carousel-inner" role="listbox">
                <div className="carousel-item active" style={{ backgroundImage: 'url(data:image/jpeg;base64,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)' }}>
                  <div className="carousel-container">
                    <div className="container">
                      <h2 className="animate__animated animate__fadeInDown">Selamat Datang</h2>
                      <p className="animate__animated animate__fadeInUp">Silahkan scan Qr anda atau masukkan manual</p>
                      <a data-toggle="modal" data-target="#exampleModal" href="#featured-services" className="btn-get-started scrollto animate__animated animate__fadeInUp">Absen</a>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>{/* End Intro Section */}
      </div>

    </div>
  );
}

export default App;
