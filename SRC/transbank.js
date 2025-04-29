const { WebpayPlus } = require('transbank-sdk');

const commerceCode = '597055555532';
const apiKey = '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C';

WebpayPlus.configureForTesting();

const tx = new WebpayPlus.Transaction();

const createTransaction = async (amount, orderId, returnUrl) => {
    try {

        const parsedAmount = parseInt(amount);
        if (isNaN(parsedAmount)) {
            throw new Error('El monto debe ser un número válido');
        }

        const sessionId = `session_${orderId}`;
        

        const cleanReturnUrl = returnUrl.replace(/[`\s]/g, '');
        
        console.log('Creando transacción con URL limpia:', cleanReturnUrl);
        
        const response = await tx.create(
            orderId,
            sessionId,
            parsedAmount,
            cleanReturnUrl    
        );
        
        return response;
    } catch (error) {
        console.error('Error creating transaction:', error);
        throw error;
    }
};

const commitTransaction = async (token) => {
    try {
        const response = await tx.commit(token);
        return response;
    } catch (error) {
        console.error('Error committing transaction:', error);
        throw error;
    }
};

module.exports = {
    createTransaction,
    commitTransaction
};