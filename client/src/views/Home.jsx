import React, { useState, useEffect, useContext, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  CONSTANT,
  setMessage,
  resetMessage,
  checkLoginFromLogin,
  checkLoginFromNonLogin,
} from "../CONSTANT";
import UserData from "../contexts/UserData";
import {
  InfoWindow,
  GoogleMap,
  useLoadScript,
  Marker,
} from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

export default function Home() {
  const { session, setSession } = useContext(UserData);
  const [selected, setSelected] = useState(null);
  const processAddress = async (address, rtn = false) => {
    const results = await getGeocode({ address });
    const { lat, lng } = await getLatLng(results[0]);
    let obj = {
      lat: lat,
      lng: lng,
    };
    if (!rtn) {
      setSelected(obj);
    } else {
      return obj;
    }
  };

  useEffect(() => {
    if (session.isLoggedIn) {
      processAddress(session?.personal?.address);
    }
  }, [session]);

  const [people, setPeople] = useState([]);

  const fetchPeople = async (e) => {
    await axios
      .get(CONSTANT.server + `user/${session.personal.id}`)
      .then(async (responce) => {
        const final = await Promise.all(
          responce.data.map(async (a, b) => {
            const results = await getGeocode({
              address: a.address,
            });
            const { lat, lng } = await getLatLng(results[0]);
            return {
              ...a,
              geo: {
                lat: lat,
                lng: lng,
              },
            };
          })
        );
        setPeople(final);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    if (session.isLoggedIn) {
      fetchPeople();
    }
  }, [session]);

  return (
    <div>
      <Map selected={selected} people={people} />
    </div>
  );
}

function Map(props) {
  const center = useMemo(() => ({ lat: 43.45, lng: -80.49 }), []);
  const [selectedMarker, setSelectedMarker] = useState(null);

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
  };

  return (
    <>
      <GoogleMap
        zoom={15}
        center={props.selected ?? center}
        mapContainerClassName="map-container min-h-[calc(100vh-5rem)]"
      >
        {props.selected && (
          <Marker
            position={props.selected}
            icon={"home.png"}
            onClick={() => handleMarkerClick(props.selected)}
          >
            {selectedMarker === props.selected && (
              <InfoWindow onCloseClick={() => setSelectedMarker(null)}>
                <div>
                  <h3>My Sweet Home</h3>
                </div>
              </InfoWindow>
            )}
          </Marker>
        )}
        {props.people
          .filter((one, i) => {
            return one.role === "acceptor";
          })
          .map((one, i) => {
            return (
              <Marker
                position={one.geo}
                icon={"help.png"}
                onClick={() => handleMarkerClick(one.geo)}
              >
                {selectedMarker === one.geo && (
                  <InfoWindow onCloseClick={() => setSelectedMarker(null)}>
                    <div>
                      <h3 className="font-bold">History</h3>
                      <p>9 people have helped previouly!</p>
                      <p>Took last help on 3rd March, 23.</p>
                      <br />
                      <h3 className="font-bold">Last Review</h3>
                      <p>He's a legit very needy!</p>
                    </div>
                  </InfoWindow>
                )}
              </Marker>
            );
          })}
      </GoogleMap>
    </>
  );
}
