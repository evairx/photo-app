/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';

const PhotoLibrary = () => {
  // Defino las imágenes como un arreglo para repetir en el grid
  const photos = new Array(20).fill({
    url: 'https://imgsrv.crunchyroll.com/cdn-cgi/image/fit=contain,format=auto,quality=85,width=184/catalog/crunchyroll/29e0d306dbff3a163acadf66a35b3cf5.jpg',
    title: 'Crunchyroll Image'
  });

  return (
    <StyledPhotoLibrary>
      {photos.map((photo, index) => (
        <StyledPhotoCard key={index}>
          <img src={photo.url} alt={photo.title} />
        </StyledPhotoCard>
      ))}
    </StyledPhotoLibrary>
  );
};

// Estilos para el contenedor de la biblioteca de fotos
const StyledPhotoLibrary = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); /* Cambio tamaño mínimo */
  gap: 16px;
  padding: 16px;
  width: 100%;
  box-sizing: border-box;
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); /* Más pequeño en pantallas pequeñas */
  }
`;

// Estilos para las tarjetas de foto
const StyledPhotoCard = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 8px;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export default PhotoLibrary;
