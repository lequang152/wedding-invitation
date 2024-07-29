import { useRef, useState } from 'react';
import styled from '@emotion/styled';
import styles from './style.module.css';

// import { push, ref, serverTimestamp } from 'firebase/database';
// import { realtimeDb } from '../../firebase.ts';

// TODO: 방명록 기능 사용시, realtime db에 guestbook 추가
// const guestbookRef = ref(realtimeDb, 'guestbook');

const CommentForm = () => {
  const [name, setName] = useState<string>('');
  const [attendance, setAttendance] = useState('');
  const [side, setSide] = useState('');
  const [loading, setLoading] = useState(false);
  const [selection, setSelection] = useState('1');
  const [numberOfPeople, setNumberOfPeople] = useState(2);

  const myRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!numberOfPeople && selection === 'more') {
      alert('Bạn hãy điền đầy đủ thông tin nhéee. 🥹');
      return;
    }
    if (!name || !attendance || !side || (selection === 'more' && numberOfPeople < 1)) {
      alert('Bạn hãy điền đầy đủ thông tin nhéee. 🥹');
    } else {
      const guestbookMessage = {
        STT: 1,
        'Họ Và Tên': name,
        'Sẽ Đến Không': attendance,
        'Số lượng người': attendance == 'không' ? 0 : selection === 'more' ? numberOfPeople : 1,
        'Là Khách mời của ai': side,
      };

      try {
        setLoading(true);
        fetch('https://sheet.best/api/sheets/a1e0b53e-2c83-4fb7-9294-5ea699d2add6', {
          method: 'GET',
        })
          .then((response) => response.json())
          .then((data) => {
            guestbookMessage.STT = data.length + 1;

            fetch('https://sheet.best/api/sheets/a1e0b53e-2c83-4fb7-9294-5ea699d2add6', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(guestbookMessage),
            })
              .then((response) => response.json())
              .then((_data) => {
                setLoading(false);
                alert('Gửi thông tin thành công. Cảm ơn bạn nhiều nhé💌');
              })
              .catch((error) => {
                setLoading(false);
                console.error('Error:', error);
              });
          })
          .catch((error) => {
            setLoading(false);
            console.error('Error:', error);
          });
      } catch (error) {
        setLoading(false);
        console.error('Error:', error);
      }

      setAttendance('');
      setSelection('1');
      setSide('');
      setName('');
    }
  };

  return (
    <FormWrapper onSubmit={handleSubmit}>
      {loading && (
        <div
          style={{
            position: 'fixed', // or 'absolute' if you're dimming a specific container
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000, // Ensure it's above other content
          }}>
          <div
            className={`${styles['fadeInOutText']}`}
            style={{ color: 'white', fontSize: '20px' }}>
            Đang gửi ...
          </div>
        </div>
      )}{' '}
      <RadioWrapper>
        <label>
          <RadioInput
            type="radio"
            value="có"
            checked={attendance === 'có'}
            onChange={() => setAttendance('có')}
          />
          Mình chắc chắn sẽ tham dự 🥳
        </label>
        <label>
          <RadioInput
            type="radio"
            value="không"
            checked={attendance === 'không'}
            onChange={() => setAttendance('không')}
          />
          Mình không thể tham dự 😢
        </label>
      </RadioWrapper>
      <div
        style={{
          width: '100%',
          textAlign: 'start',
        }}>
        Tên của bạn
      </div>
      <NameInput
        placeholder="Họ và tên..."
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      {/* <MessageInput
        placeholder="Lời nhắn"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      /> */}
      {attendance == 'có' && (
        <>
          <div
            style={{
              width: '100%',
              textAlign: 'start',
            }}>
            Bạn sẽ đến cùng với
          </div>
          <SelectInput
            value={selection}
            onChange={(e) => {
              setSelection(e.target.value);
              if (e.target.value === 'more') {
                if (myRef.current) {
                  myRef.current.focus();
                }
              }
            }}>
            <OptionInput value="1">Tôi đi một mình</OptionInput>
            <OptionInput value="more">Tôi đi cùng với người thân</OptionInput>
          </SelectInput>
          {selection === 'more' && (
            <>
              <div
                style={{
                  width: '100%',
                  textAlign: 'start',
                }}>
                Số lượng người{' '}
              </div>
              <NumberInput
                ref={myRef}
                type="number"
                value={numberOfPeople}
                onChange={(e) => setNumberOfPeople(parseInt(e.target.value, 10))}
                min="2"
              />
            </>
          )}
        </>
      )}
      {/* <NumberInput
        type="number"
        value={guests}
        onChange={(e) => {
          const value = parseInt(e.target.value, 10);
          setGuests(Number.isNaN(value) ? 0 : value);
        }}
        placeholder="Số lượng người đi cùng"
      /> */}
      <div
        style={{
          width: '100%',
          textAlign: 'start',
        }}>
        Bạn là khách mời của ai?{' '}
      </div>
      <RadioWrapper>
        <label>
          <RadioInput
            type="radio"
            value="cô dâu"
            checked={side === 'cô dâu'}
            onChange={() => setSide('cô dâu')}
          />
          Cô dâu
        </label>
        <label>
          <RadioInput
            type="radio"
            value="chú rể"
            checked={side === 'chú rể'}
            onChange={() => setSide('chú rể')}
          />
          Chú rể
        </label>
      </RadioWrapper>
      <SubmitButton
        style={{
          cursor: loading ? 'progress' : '',
          opacity: loading ? 0.5 : 1,
        }}
        type="submit">
        Gửi
      </SubmitButton>
    </FormWrapper>
  );
};

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: visible;
  align-items: center;
`;

const NameInput = styled.input`
  font-family: system-ui;
  width: 100%;
  box-sizing: border-box;
  border-radius: 4px;
  padding: 8px;
  font-size: 1rem;
  line-height: 1;
  outline: none;
  border: 1px solid #ccc;
  font-family: inherit;
  font-weight: 300;
  margin-bottom: 20px;
  &:hover,
  &:focus {
    border-color: #007bff;
  }
`;

// const MessageInput = styled.textarea`
//   width: 100%;
//   height: 100%;
//   box-sizing: border-box;
//   border-radius: 4px;
//   padding: 4px;
//   font-size: 1rem;
//   line-height: 1.5;
//   outline: none;
//   border: 1px solid #ccc;
//   resize: none;
//   font-family: inherit;
//   font-weight: 300;
// `;

const SubmitButton = styled.button`
  width: 100%;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 1rem;
  line-height: 1.5;
  border: 1px solid lightgray;
  background-color: white;
  font-family: inherit;
  font-weight: inherit;
  color: inherit;
`;

const RadioWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justyfy-content: center;
  align-items: start;
  margin-bottom: 20px;
  width: 100%;
`;

const RadioInput = styled.input`
  margin-right: 10px;
`;

const NumberInput = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 20px;
  border-radius: 4px;
  border: 1px solid #ccc;

  outline: none;
  box-sizing: border-box;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  &:hover,
  &:focus {
    border-color: #007bff;
  }

  /* Firefox */
  &[type='number'] {
    -moz-appearance: textfield;
  }
`;

const SelectInput = styled.select`
  width: 100%;
  padding: 8px;
  margin-bottom: 20px;
  border-radius: 4px;
  border: 1px solid #ccc;
  outline: none;
  box-sizing: border-box;
  &:hover,
  &:focus {
    border-color: #007bff;
  }
`;

const OptionInput = styled.option`
  padding: 4px;
  cursor: pointer;
`;
export default CommentForm;
