import { Button, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
// Source for using geolocation: https://www.youtube.com/watch?v=VK9F8BWrOgY

export const SelectLocation = () => {
	const [isLocationAllowed, setIsLocationAllowed] = useState(true)
	const supportedCountries =
	[
		{
			name: 'Finland', 
			code: 'FI'
		},
		{
			name: 'Sweden', 
			code: 'SWE'
		},
		{
			name: 'Norway', 
			code: 'NOR'
		}
	];

	let navigate = useNavigate();

	const onSuccess = (position) => {
			setIsLocationAllowed(true)
			const ltd = position.coords.latitude;
			const lng = position.coords.longitude;

			// * The api key must be set to the env variables before running react
			const locationApiUrl = `
			https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${ltd}&longitude=${lng}
			`
			fetch(locationApiUrl)
			.then(res => res.json())
			.then(data => {
				sessionStorage.setItem('countryCode', data.countryCode);
				navigate(`/`, { replace: true });
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
			<Typography padding={2} variant='h4'>Select your location</Typography>
			{isLocationAllowed && <Button size='small' variant="contained" onClick={findMyCountry}>Use My Current Location</Button>}
			{!isLocationAllowed && 
				<Box>
					<Typography variant='body'>Please select which country's shop you want to use!</Typography>
					<Box sx={{m : 2}}>
						{supportedCountries.map((country) => (
										<Button size='small' variant="contained" sx={{m: 0.5}} key={country.code} id={country.code} onClick={setCountryCode}> {country.name} </Button>
									))}
					</Box>
				</Box>
			}
		</Box>
		
  )
}
