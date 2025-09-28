import React from 'react';
import { Button, Typography, Box, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const PaymentSuccess: React.FC = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/'); // กลับไปหน้าแรกของร้านอาหาร
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
                    ชำระเงินสำเร็จ!
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    ขอบคุณที่ใช้บริการ ร้านอาหารของคุณได้รับการอัปเดตการชำระเงินเรียบร้อยแล้ว
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 4 }}
                    onClick={handleGoHome}
                >
                    กลับไปหน้าหลัก
                </Button>
            </Box>
        </Container>
    );
};

export default PaymentSuccess;
