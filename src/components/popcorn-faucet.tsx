"use client"

import { useEffect } from "react";

import React, { useRef } from 'react';
import Matter from 'matter-js';

export const PopcornFaucet = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const Engine = Matter.Engine;
    const Render = Matter.Render;
    const Runner = Matter.Runner;
    const Bodies = Matter.Bodies;
    const Events = Matter.Events;
    const Composite = Matter.Composite;
    const Composites = Matter.Composites;
    const Common = Matter.Common;
    const MouseConstraint = Matter.MouseConstraint;
    const Mouse = Matter.Mouse;

    const engine = Engine.create({ enableSleeping: false, timing: { timeScale: 1 } });
    engineRef.current = engine;
    const world = engine.world;

    const render = Render.create({
      canvas: canvasRef.current,
      engine: engine,
      options: {
        width: canvasRef.current.offsetWidth,
        height: canvasRef.current.offsetHeight,
        wireframes: false,
        background: 'transparent'
      }
    });

    Render.run(render);
    Runner.run(Runner.create(), engine);

    const wallThickness = 50;
    const walls = [
      Bodies.rectangle(render.options.width ? render.options.width / 2 : 0, -wallThickness / 2, render.options.width || 0, wallThickness, { isStatic: true, render: { fillStyle: 'transparent' } }),
      Bodies.rectangle(render.options.width ? render.options.width / 2 : 0, (render.options.height || 0) + wallThickness / 2, render.options.width || 0, wallThickness, { isStatic: true, render: { fillStyle: 'transparent' } }),
      Bodies.rectangle((render.options.width || 0) + wallThickness / 2, (render.options.height || 0) / 2, wallThickness, render.options.height || 0, { isStatic: true, render: { fillStyle: 'transparent' } }),
      Bodies.rectangle(-wallThickness / 2, (render.options.height || 0) / 2, wallThickness, render.options.height || 0, { isStatic: true, render: { fillStyle: 'transparent' } })
    ];

    Composite.add(world, walls);

    const createPopcornTexture = (size: number): HTMLCanvasElement => {
      const canvas = document.createElement('canvas');
      canvas.width = size * 2;
      canvas.height = size * 2;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.font = `${size * 1.5}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🍿', size, size);
      }
      return canvas;
    };

    const createPopcornParticle = (x: number, y: number): Matter.Body => {
      const size = Common.random(15, 40);
      const texture = createPopcornTexture(size);
      return Bodies.circle(x, y, size / 2, {
        restitution: 0.8,
        friction: 0.009,
        frictionAir: 0.001,
        render: { sprite: { texture: texture.toDataURL(), xScale: 1, yScale: 1 } }
      });
    };

    const stack = Composites.stack(50, (render.options.height || 0) - 100, 10, 3, 10, 10, createPopcornParticle);
    Composite.add(world, stack);

    const explosion = (engine: Matter.Engine): void => {
      const bodies = Composite.allBodies(engine.world);
      bodies.forEach((body) => {
        if (!body.isStatic && render.options.height && body.position.y >= render.options.height - 100) {
          const forceMagnitude = 0.05 * body.mass;
          Matter.Body.applyForce(body, body.position, {
            x: (forceMagnitude + Common.random() * forceMagnitude) * Common.choose([1, -1]),
            y: -forceMagnitude + Common.random() * -forceMagnitude
          });
        }
      });
    };

    let lastTime = Common.now();

    Events.on(engine, 'afterUpdate', () => {
      const currentTime = Common.now();
      if (currentTime - lastTime >= 2000) {
        explosion(engine);
        lastTime = currentTime;
      }

      const bodies = Composite.allBodies(engine.world);
      bodies.forEach((body) => {
        const { x, y } = body.position;
        const width = render.options.width || 0;
        const height = render.options.height || 0;
        if (x < -50) Matter.Body.setPosition(body, { x: width + 50, y });
        if (x > width + 50) Matter.Body.setPosition(body, { x: -50, y });
        if (y < -50) Matter.Body.setPosition(body, { x, y: height + 50 });
        if (y > height + 50) Matter.Body.setPosition(body, { x, y: -50 });
      });
    });

    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: { stiffness: 0.2, render: { visible: false } }
    });

    Composite.add(world, mouseConstraint);
    render.mouse = mouse;

    Render.lookAt(render, {
      min: { x: 0, y: 0 },
      max: { x: render.options.width || 0, y: render.options.height || 0 }
    });

    const handleResize = (): void => {
      if (canvasRef.current) {
        render.canvas.width = canvasRef.current.offsetWidth;
        render.canvas.height = canvasRef.current.offsetHeight;
        Matter.Render.setPixelRatio(render, window.devicePixelRatio);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      Render.stop(render);
      Runner.stop(Runner.create());
      Engine.clear(engine);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-[300px]" />;
};

