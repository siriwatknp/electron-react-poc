import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function SellerProfileForm() {
  const navigate = useNavigate();
  const [ready, setReady] = React.useState(false);
  const [profile, setProfile] = React.useState({
    fullname: '',
    birthdate: '',
    nationalId: '',
    address: '',
    photo: '',
    companyName: '',
    tel: '',
    carType: null,
    licensePlate: '',
  });
  const saveCardToProfile = React.useCallback(() => {
    const data = window.electron.cardReader.getData();
    if (data) {
      console.log('data', data);
      setProfile((prevData) => ({
        ...prevData,
        nationalId: data.cid,
        address: data.address,
        fullname: `${data.thName.prefix} ${data.thName.firstname} ${data.thName.lastname}`,
        photo: data.photo,
        birthdate: `${data.dob.day}/${data.dob.month}/${data.dob.year}`,
      }));
    }
  }, []);
  React.useEffect(() => {
    const initialReady = window.electron.cardReader.check();
    setReady(initialReady);
    saveCardToProfile();
    const unsubscribe = window.electron.cardReader.connect((event, bool) => {
      setReady(bool);
    });
    return () => {
      unsubscribe();
    };
  }, [saveCardToProfile]);
  return <div>fullname: {ready ? <p>{profile.fullname}</p> : null}</div>;
}
