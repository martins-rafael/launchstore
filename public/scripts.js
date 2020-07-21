const Mask = {
    apply(input, func){
        setTimeout(function(){
            input.value = Mask[func](input.value);
        });
    },
    formatBRL(value){
        value = value.replace(/\D/g, '');

        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value / 100);

        event.target.value = value;
    }
};