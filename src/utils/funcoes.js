function FormataData(data_compra) {
    const [dia, mes, ano] = data_compra.split('/');
    return `${ano}-${mes}-${dia}`;
}

module.exports = { FormataData }