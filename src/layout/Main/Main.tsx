import styled from '@emotion/styled';
import data from 'data.json';
import mainImg from '@/assets/images/anh_1.jpg';

const Main = () => {
  const { greeting } = data;
  return (
    <div>
      <MainImg src={mainImg} />
      <MainTitle>{greeting.title}</MainTitle>
      <SubTitle>{greeting.eventDetail}</SubTitle>
    </div>
  );
};

export default Main;

const MainImg = styled.img`
  border-radius: 200px 200px 0 0;
  width: 90%;
  max-width: 450px;
  padding-top: 20px;
`;

const MainTitle = styled.p`
  font-family: system-ui;
  font-size: 2.5rem;
  color: #2f2120;
  line-height: 120%;
  white-space: pre-line;
`;

const SubTitle = styled.p`
  font-family: system-ui;
  font-size: 1.1rem;
  color: #2f2120;
  line-height: 140%;
  white-space: pre-line;
`;
