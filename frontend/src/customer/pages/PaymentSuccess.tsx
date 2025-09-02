import React from 'react';
import { Button, Typography, Box, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const PaymentSuccess: React.FC = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 8 }}>
            <Box>
                <img 
                    src="https://cdn-icons-png.flaticon.com/512/845/845646.png" 
                    alt="success" 
                    style={{ width: 80, height: 80, marginBottom: 16 }} 
                />

                <Typography variant="h4" gutterBottom>
                    Payment Successful!
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    Thank you for your purchase. Your payment has been processed successfully.
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 4 }}
                    onClick={handleGoHome}
                >
                    Go to Home
                </Button>
            </Box>
        </Container>
    );
};

export default PaymentSuccess;