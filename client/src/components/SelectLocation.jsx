import { Button, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import {useTranslation} from 'react-i18next';
// Source for using geolocation: https://www.youtube.com/watch?v=VK9F8BWrOgY

export const SelectLocation = () => {
	const { t } = useTranslation(['i18n']);
	const [isLocationAllowed, setIsLocationAllowed] = useState(true)
	const supportedCountries =
	[
		{
			name: 'Suomi', 
			code: 'FI'
		},
		{
			name: 'Sverige', 
			code: 'SWE'
		},
		{
			name: 'Norge', 
			code: 'NOR'
		}
	];

	let navigate = useNavigate();

	const onSuccess = (position) => {
			setIsLocationAllowed(true)
			let ltd = position.coords.latitude;
			let lng = position.coords.longitude;
			let isCountrySupported = false
			console.log(ltd,lng);
			// * The api key must be set to the env variables before running react
			const locationApiUrl = `
			https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${ltd}&longitude=${lng}
			`
			fetch(locationApiUrl)
			.then(res => res.json())
			.then(data => {
				supportedCountries.forEach(country => {
					console.log(data.countryCode);
					if(country.code === data.countryCode){
						sessionStorage.setItem('countryCode', data.countryCode);
						isCountrySupported = true
						navigate(`/`, { replace: true });
					}
				});
				if(!isCountrySupported){
					setIsLocationAllowed(false);
				}
				
			})
			.catch(error => {
				setIsLocationAllowed(false);
				console.log('Error while fetching from location API', error);
		})
	}

	const onError = (error) => {
		if(error.code === 1){
			setIsLocationAllowed(false)
		}
	}

	const findMyCountry = () => {
		navigator.geolocation.getCurrentPosition(onSuccess, onError);
	}

	const setCountryCode = (element) => {
		sessionStorage.setItem('countryCode', element.target.id)
		navigate(`/`, { replace: true });
	}
	

  return (
    <Box>
			<Typography padding={2} variant='h4'>{t("SelectYourLoc")}</Typography>
			{isLocationAllowed && <Button size='small' variant="contained" onClick={findMyCountry}>{t("UseMyLoc")}</Button>}
			{!isLocationAllowed && 
				<Box>
					<Typography variant='body'>{t("SelectCountry")}</Typography>
					<Box sx={{m : 2}}>
						{supportedCountries.map((country) => (
										<Button size='small' variant="contained" sx={{m: 0.5}} key={country.code} id={country.code} onClick={setCountryCode}>{country.name}</Button>
									))}
					</Box>
				</Box>
			}
		</Box>
		
  )
}
