import { Cursor } from '../src/RegexpEngine';
import { expect, it, tests } from './helper';

tests('Cursor', () => {
  it('cr.read()', () => {
    const cr = new Cursor(`
      @name
    `);

    expect(cr.read()).toBe('@');
    expect(cr.read()).toBe('n');
    expect(cr.read()).toBe('a');
    expect(cr.read()).toBe('m');
    expect(cr.read()).toBe('e');
  });

  it('cr.readLine()', () => {
    const cr = new Cursor(`
      @name #name
      @age #number
    `);

    expect(cr.readLine()).toBe('@name #name');
    expect(cr.readLine()).toBe('@age #number');
  });

  it('cr.back()', () => {
    const cr = new Cursor(`
      @name
    `);

    expect(cr.read()).toBe('@');
    expect(cr.read()).toBe('n');
    cr.back();
    cr.back();
    expect(cr.read()).toBe('@');
    expect(cr.read()).toBe('n');
  });

  it('cr.goto(index)', () => {
    const cr = new Cursor(`
      @name
      @age
    `);

    cr.goto(2);
    expect(cr.read()).toBe('a');
    cr.goto(6);
    expect(cr.read()).toBe('@');
  });

  it('cr.save(), sr.remove()', () => {
    const cr = new Cursor(`
      @name #name
      @age
    `);

    cr.save();
    cr.read();
    cr.read();
    cr.read();
    cr.read();
    cr.read();
    cr.read();
    cr.remove();

    expect(cr.read()).toBe('#');
  });

  it('cr.save(), sr.rollback()', () => {
    const cr = new Cursor(`
      @name #name
      @age
    `);

    cr.save(); // 存@位置
    cr.read();
    cr.save(); // 存n位置
    cr.read();
    cr.rollback();
    expect(cr.read()).toBe('n');
    cr.rollback();
    expect(cr.read()).toBe('@');
  });
});
