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

const PhotosUpload = {
    uploadLimit: 6,
    handleFileInput(event) {
        const { files: fileList } = event.target;
        const { uploadLimit } = PhotosUpload;

        if (fileList.length > uploadLimit) {
            alert(`Envie no máximo ${uploadLimit} fotos.`);
            event.preventDefault();
            return;
        }
    }
};