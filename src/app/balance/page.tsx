'use client';
import { activateDailyBonus, activatePromo } from '@/actions/playerAction';
import Button from '@/components/Button/Button';
import { useSession } from 'next-auth/react';
import { useContext, useState } from 'react';
import { CurrentPlayerContext, PlayerContextType } from '../Providers';
import Input from '@/components/Input/Input';

export default function Balance() {
	const session = useSession();
	const playerEmail = session.data?.user?.email as string;
	const { balance, updateBalance } = useContext(CurrentPlayerContext) as PlayerContextType;
	const [disabled, setDisabled] = useState(false);
	const [promo, setPromo] = useState('');

	const getDailyBonus = () => {
		setDisabled(true);
		activateDailyBonus(playerEmail)
			.then((res) => {
				res?.newBalance && updateBalance(res.newBalance);
				res?.message && alert(res.message);
			})
			.finally(() => {
				setDisabled(false);
			});
	};

	const getPromo = () => {
		setDisabled(true);
		activatePromo(playerEmail, promo)
			.then((res) => {
				res?.newBalance && updateBalance(res.newBalance);
				res?.message && alert(res.message);
			})
			.finally(() => setDisabled(false));
	};

	const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPromo(e.target.value);
	};

	return (
		<div className='page'>
			<h2>{playerEmail && `${playerEmail.substring(0, playerEmail.indexOf('@'))}, your balance: $${balance}`}</h2>
			<h2>Daily bonus</h2>
			<Button onClick={getDailyBonus} disabled={!session.data?.user || disabled}>
				Get daily $1
			</Button>
			<h2>Enter promocode</h2>
			<h3>kitstart gives 10$ for new players</h3>
			<Input placeholder={'promocode'} onChange={onChangeHandler} />
			<Button onClick={getPromo} disabled={!session.data?.user || disabled || promo.length < 5 || promo.length > 20}>
				Activate
			</Button>
		</div>
	);
}
