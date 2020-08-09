import React, { useState, FormEvent } from 'react';
import { useHistory } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';

import TextArea from '../../components/TextArea';
import Select from '../../components/Select';

import './styles.css';
import Input from '../../components/Input';
import warningIcon from '../../assets/images/icons/warning.svg'
import api from '../../services/api';


const TeacherForm = () => {

  const history = useHistory();

  const [name, setName] = useState('');
  const [photo, setPhoto] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [bio, setBio] = useState('');
  
  const [subject, setSubject] = useState('');
  const [cost, setCost] = useState('');
  
  const [scheduleItems, setScheduleItems] = useState([
    {day: 0, from: '', to: ''}
  ]);

  const addScheduleItem = () => {
    setScheduleItems([...scheduleItems, {day: 0, from: '', to: ''}]);
  }

  const updateScheduleItem = (position: number, field: string, value: string) => {
    const updatedScheduleItems = scheduleItems.map((item, index) => {
      if (index === position) return {...item, [field]: value};
      return item;
    })
    setScheduleItems(updatedScheduleItems);
  }

  const handleCreateclass = (e: FormEvent) => {
    e.preventDefault();

    api.post('classes', {
      name,
      avatar: photo,
      whatsapp,
      bio,
      subject,
      cost: Number(cost),
      schedule: scheduleItems
    }).then(() => {
      history.push('/');
      alert('Cadastro realizado com sucesso!');
    }).catch(() => alert('Erro na criação'))

  }

	return (
		<div id="page-teacher-form" className="container">
			<PageHeader title="Que incrível que você quer dar aulas." description="O primeiro passo é preencher esse formulário de inscrição"></PageHeader>

      <main>
        <form onSubmit={handleCreateclass}>
          <fieldset>
            <legend>Seus dados</legend>

            <Input name="name" label="Nome completo" value={name} onChange={e => setName(e.target.value)}/>
            <Input name="foto" label="Foto" value={photo} onChange={e => setPhoto(e.target.value)}/>
            <Input name="whatsapp" label="Whatsapp" value={whatsapp} onChange={e => setWhatsapp(e.target.value)}/>
            <TextArea name="bio" label="Biografia" value={bio} onChange={e => setBio(e.target.value)}/>
          </fieldset>

          <fieldset>
            <legend>Dados da aula</legend>

            <Select name="subject" label="Matéria" value={subject} onChange={e => setSubject(e.target.value)} options={[
              { value: 'Artes', label: 'Artes' },
              { value: 'Biologia', label: 'Biologia' },
              { value: 'Educação física', label: 'Educação física' },
              { value: 'Física', label: 'Física' },
              { value: 'Geografia', label: 'Geografia' },
              { value: 'História', label: 'História' },
              { value: 'Matemática', label: 'Matemática' },
              { value: 'Português', label: 'Português' },
              { value: 'Química', label: 'Química' },
            ]}/>
            <Input name="cost" value={cost} onChange={e => setCost(e.target.value)} label="Custo por hora"/>
          </fieldset>

          <fieldset>
            <legend>Horários disponíveis<button type="button" onClick={addScheduleItem}>+ Novo Horário</button></legend>
            {scheduleItems.map((item, index) => <div key={item.day} className="schedule-item">
              <Select name="day" label="Dia da semana" value={item.day} onChange={e => updateScheduleItem(index, 'day', e.target.value)} options={[
                { value: '0', label: 'Domingo' },
                { value: '1', label: 'Segunda-feira' },
                { value: '2', label: 'Terça-feira' },
                { value: '3', label: 'Quarta-feira' },
                { value: '4', label: 'Quinta-feira' },
                { value: '5', label: 'Sexta-feira' },
                { value: '6', label: 'Sábado' }
              ]}/>
              <Input name="from" label="Das" type="time" value={item.from} onChange={e => updateScheduleItem(index, 'from', e.target.value)}/>
              <Input name="to" label="Até" type="time" value={item.to} onChange={e => updateScheduleItem(index, 'to', e.target.value)}/>
            </div>)}
            
          </fieldset>
          <footer>
            <p>
              <img src={warningIcon} alt="Aviso importante"/>
              Importante! <br />
              Preencha todos os dados
            </p>
            <button type="submit">
              Salvar cadastro
            </button>
          </footer>
        </form>
      </main>
		</div>
	);
};

export default TeacherForm;
