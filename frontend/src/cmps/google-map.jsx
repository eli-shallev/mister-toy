import React, { useState } from "react";
import GoogleMapReact from 'google-map-react';

function CustomMarker({ text, handleClick, coordsinates }) {
    return (
        <div onClick={() => handleClick(coordsinates)} style={{ color: 'red', fontSize: '3em' }}>
            {text}
        </div>
    )
}

export function GoogleMap() {
    const [CenterCoordinates, setCenterCoordinates] = useState({ lat: 31.99612839968232, lng: 34.95303850597809 })
    const [zoom, setZoom] = useState(10)
    const tlvCoordinates = { lat: 32.09184423370253, lng: 34.788072809711785 }
    const modiinCoordinates = { lat: 31.896195489335202, lng: 35.01110618121365 }
    const herzliyaCoordinates = { lat: 32.17662239427968, lng: 34.8388409554869 }

    function handleClick({ lat, lng }) {
        setZoom(14)
        setCenterCoordinates({ lat, lng })
    }

    return (
        // Important! Always set the container height explicitly
        <div className="google-map">
            <div className="branch-container">
                <div className="branch-item">
                    <h3>Tal Aviv branch</h3>
                    <span>Tel: 1800-TLVToys</span>
                    <span>Address: 58, Toy street, Tel Aviv</span>
                    <button onClick={() => handleClick(tlvCoordinates)}>Go to Branch</button>
                </div>
                <div className="branch-item">
                    <h3>Modiin branch</h3>
                    <span>Tel: 1800-MDNToys</span>
                    <span>Address: 123, Toy street, Modiin</span>
                    <button onClick={() => handleClick(modiinCoordinates)}>Go to Branch</button>
                </div>
                <div className="branch-item">
                    <h3>Herzliya branch</h3>
                    <span>Tel: 1800-HRZToys</span>
                    <span>Address: 79, Toy street, Herzliya</span>
                    <button onClick={() => handleClick(herzliyaCoordinates)}>Go to Branch</button>
                </div>
            </div>
            <div className="map-container" >
            <GoogleMapReact
                bootstrapURLKeys={{ key: "AIzaSyCs25ULg84X5AAwQgzvEWyf9Caf-68w7Mk" }}
                defaultCenter={CenterCoordinates}
                center={CenterCoordinates}
                onZoomAnimationEnd={setZoom}
                defaultZoom={zoom}
                zoom={zoom}
            >
                <CustomMarker
                    {...tlvCoordinates}
                    text={<i className="fa-solid fa-location-dot"></i>}
                    handleClick={handleClick}
                    coordsinates={tlvCoordinates}
                />
                <CustomMarker
                    {...modiinCoordinates}
                    text={<i className="fa-solid fa-location-dot"></i>}
                    handleClick={handleClick}
                    coordsinates={modiinCoordinates}
                />
                <CustomMarker
                    {...herzliyaCoordinates}
                    text={<i className="fa-solid fa-location-dot"></i>}
                    handleClick={handleClick}
                    coordsinates={herzliyaCoordinates}

                />
            </GoogleMapReact>
            </div>
        </div>
    );
}