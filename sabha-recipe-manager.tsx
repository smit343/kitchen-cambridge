import { useState, useEffect, useRef } from 'react';
import { Button } from "/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "/components/ui/card";
import { Input } from "/components/ui/input";
import { Label } from "/components/ui/label";
import { Textarea } from "/components/ui/textarea";
import { Home, Calendar, Plus, Book, Sun, Moon, Search, Trash, Edit, Eye, Download, Upload } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";

type Event = {
  id: string;
  date: string;
  eventName: string;
  pujyaSanto: string;
  totalBhaktas: number;
  gents: number;
  ladies: number;
  menu: string;
  ingredients: string;
  peopleCount: number;
  leftoverFood: string;
  remadeItems: string;
  notes: string;
};

type Recipe = {
  id: string;
  name: string;
  ingredients: string;
  process: string;
  category: string;
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function SabhaRecipeManager() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'addEvent' | 'events' | 'recipes'>('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [eventForm, setEventForm] = useState<Omit<Event, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    eventName: '',
    pujyaSanto: '',
    totalBhaktas: 0,
    gents: 0,
    ladies: 0,
    menu: '',
    ingredients: '',
    peopleCount: 0,
    leftoverFood: '',
    remadeItems: '',
    notes: ''
  });
  const [recipeForm, setRecipeForm] = useState<Omit<Recipe, 'id'>>({
    name: '',
    ingredients: '',
    process: '',
    category: 'Main Course'
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showRecipeForm, setShowRecipeForm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load data from localStorage
  useEffect(() => {
    const storedEvents = localStorage.getItem('sabhaEvents');
    const storedRecipes = localStorage.getItem('sabhaRecipes');
    const storedTheme = localStorage.getItem('darkMode');

    if (storedEvents) setEvents(JSON.parse(storedEvents));
    if (storedRecipes) setRecipes(JSON.parse(storedRecipes));
    if (storedTheme) setDarkMode(storedTheme === 'true');
  }, []);

  // Apply dark mode
  useEffect(() => {
    document.body.className = darkMode ? 'dark bg-gray-900' : 'bg-gray-50';
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('sabhaEvents', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('sabhaRecipes', JSON.stringify(recipes));
  }, [recipes]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Event handlers
  const handleEventInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEventForm(prev => ({
      ...prev,
      [name]: name === 'totalBhaktas' || name === 'gents' || name === 'ladies' || name === 'peopleCount' 
        ? parseInt(value) || 0 
        : value
    }));
  };

  const handleSubmitEvent = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      setEvents(events.map(event => 
        event.id === editingId ? { ...eventForm, id: editingId } : event
      ));
      showToast('Event updated successfully!', 'success');
    } else {
      const newEvent = { ...eventForm, id: Date.now().toString() };
      setEvents([...events, newEvent]);
      showToast('Event added successfully!', 'success');
    }
    
    setEventForm({
      date: new Date().toISOString().split('T')[0],
      eventName: '',
      pujyaSanto: '',
      totalBhaktas: 0,
      gents: 0,
      ladies: 0,
      menu: '',
      ingredients: '',
      peopleCount: 0,
      leftoverFood: '',
      remadeItems: '',
      notes: ''
    });
    setEditingId(null);
  };

  // Recipe handlers
  const handleRecipeInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRecipeForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitRecipe = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      setRecipes(recipes.map(recipe => 
        recipe.id === editingId ? { ...recipeForm, id: editingId } : recipe
      ));
      showToast('Recipe updated successfully!', 'success');
    } else {
      const newRecipe = { ...recipeForm, id: Date.now().toString() };
      setRecipes([...recipes, newRecipe]);
      showToast('Recipe added successfully!', 'success');
    }
    
    setRecipeForm({
      name: '',
      ingredients: '',
      process: '',
      category: 'Main Course'
    });
    setEditingId(null);
    setShowRecipeForm(false);
  };

  // Data manipulation
  const deleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
    showToast('Event deleted successfully!', 'success');
  };

  const deleteRecipe = (id: string) => {
    setRecipes(recipes.filter(recipe => recipe.id !== id));
    showToast('Recipe deleted successfully!', 'success');
  };

  const editEvent = (id: string) => {
    const eventToEdit = events.find(event => event.id === id);
    if (eventToEdit) {
      setEventForm(eventToEdit);
      setEditingId(id);
      setActiveTab('addEvent');
    }
  };

  const editRecipe = (id: string) => {
    const recipeToEdit = recipes.find(recipe => recipe.id === id);
    if (recipeToEdit) {
      setRecipeForm(recipeToEdit);
      setEditingId(id);
      setShowRecipeForm(true);
    }
  };

  const exportData = () => {
    const data = {
      events,
      recipes,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sabha-manager-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showToast('Data exported successfully!', 'success');
  };

  // Filter data
  const filteredEvents = events.filter(event =>
    Object.values(event).some(
      value => value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const filteredRecipes = recipes.filter(recipe =>
    Object.values(recipe).some(
      value => value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Chart data
  const attendanceData = events.slice(-10).map(event => ({
    name: event.eventName,
    date: event.date,
    bhaktas: event.totalBhaktas
  }));

  const genderRatioData = events.slice(-5).map(event => ({
    name: event.eventName,
    gents: event.gents,
    ladies: event.ladies
  }));

  const recipeCategories = recipes.reduce((acc, recipe) => {
    acc[recipe.category] = (acc[recipe.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieChartData = Object.entries(recipeCategories).map(([name, value]) => ({
    name,
    value
  }));

  // Helper functions
  const getLatestEventDate = () => {
    if (events.length === 0) return 'No events yet';
    const latest = [...events].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    return new Date(latest.date).toLocaleDateString();
  };

  const getMostFrequentMenuItem = () => {
    if (events.length === 0) return 'No data';
    const menuItems = events.flatMap(event => event.menu.split('\n').map(item => item.trim()));
    const frequency = menuItems.reduce((acc, item) => {
      if (item) acc[item] = (acc[item] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(frequency).sort((a, b) => b[1] - a[1])[0]?.[0] || 'No data';
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className="bg-indigo-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Sabha Manager – Event & Recipe Organizer</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-indigo-700 transition-colors"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto flex overflow-x-auto">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center px-4 py-3 font-medium ${activeTab === 'dashboard' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' : 'text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-300'}`}
          >
            <Home className="w-5 h-5 mr-2" />
            Dashboard
          </button>
          <button
            onClick={() => {
              setActiveTab('addEvent');
              setEditingId(null);
              setEventForm({
                date: new Date().toISOString().split('T')[0],
                eventName: '',
                pujyaSanto: '',
                totalBhaktas: 0,
                gents: 0,
                ladies: 0,
                menu: '',
                ingredients: '',
                peopleCount: 0,
                leftoverFood: '',
                remadeItems: '',
                notes: ''
              });
            }}
            className={`flex items-center px-4 py-3 font-medium ${activeTab === 'addEvent' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' : 'text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-300'}`}
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Event
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`flex items-center px-4 py-3 font-medium ${activeTab === 'events' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' : 'text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-300'}`}
          >
            <Calendar className="w-5 h-5 mr-2" />
            Sabha Events
          </button>
          <button
            onClick={() => {
              setActiveTab('recipes');
              setShowRecipeForm(false);
            }}
            className={`flex items-center px-4 py-3 font-medium ${activeTab === 'recipes' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' : 'text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-300'}`}
          >
            <Book className="w-5 h-5 mr-2" />
            Recipe Book
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto p-4">
        {/* Search Bar */}
        {(activeTab === 'events' || activeTab === 'recipes') && (
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder={`Search ${activeTab === 'events' ? 'events' : 'recipes'}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full max-w-md"
              />
            </div>
          </div>
        )}

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold">Dashboard Overview</h2>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Total Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{events.length}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Total Bhaktas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">
                    {events.reduce((sum, event) => sum + event.totalBhaktas, 0)}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Total Recipes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{recipes.length}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Latest Event</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl font-bold">{getLatestEventDate()}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {events.length > 0 ? events[events.length - 1].eventName : 'No events'}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Most Frequent Menu</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl font-bold">{getMostFrequentMenuItem()}</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Attendance Over Time</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={attendanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="bhaktas" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Gender Ratio (Last 5 Events)</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={genderRatioData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="gents" fill="#8884d8" name="Gents" />
                      <Bar dataKey="ladies" fill="#82ca9d" name="Ladies" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {pieChartData.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Recipe Categories</CardTitle>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Add Event Tab */}
        {activeTab === 'addEvent' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">
              {editingId ? 'Edit Sabha Event' : 'Add New Sabha Event'}
            </h2>
            
            <form onSubmit={handleSubmitEvent} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    type="date"
                    id="date"
                    name="date"
                    value={eventForm.date}
                    onChange={handleEventInputChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="eventName">Event Name</Label>
                  <Input
                    type="text"
                    id="eventName"
                    name="eventName"
                    value={eventForm.eventName}
                    onChange={handleEventInputChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="pujyaSanto">Pujya Santo Present</Label>
                  <Input
                    type="text"
                    id="pujyaSanto"
                    name="pujyaSanto"
                    value={eventForm.pujyaSanto}
                    onChange={handleEventInputChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="totalBhaktas">Total Bhaktas</Label>
                  <Input
                    type="number"
                    id="totalBhaktas"
                    name="totalBhaktas"
                    value={eventForm.totalBhaktas}
                    onChange={handleEventInputChange}
                    min="0"
                  />
                </div>
                
                <div>
                  <Label htmlFor="gents">Gents</Label>
                  <Input
                    type="number"
                    id="gents"
                    name="gents"
                    value={eventForm.gents}
                    onChange={handleEventInputChange}
                    min="0"
                  />
                </div>
                
                <div>
                  <Label htmlFor="ladies">Ladies</Label>
                  <Input
                    type="number"
                    id="ladies"
                    name="ladies"
                    value={eventForm.ladies}
                    onChange={handleEventInputChange}
                    min="0"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="menu">Menu Items (one per line)</Label>
                <Textarea
                  id="menu"
                  name="menu"
                  value={eventForm.menu}
                  onChange={handleEventInputChange}
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="ingredients">Ingredients (one per line)</Label>
                <Textarea
                  id="ingredients"
                  name="ingredients"
                  value={eventForm.ingredients}
                  onChange={handleEventInputChange}
                  rows={5}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="peopleCount">For How Many People</Label>
                  <Input
                    type="number"
                    id="peopleCount"
                    name="peopleCount"
                    value={eventForm.peopleCount}
                    onChange={handleEventInputChange}
                    min="0"
                  />
                </div>
                
                <div>
                  <Label htmlFor="leftoverFood">Leftover Food</Label>
                  <Input
                    type="text"
                    id="leftoverFood"
                    name="leftoverFood"
                    value={eventForm.leftoverFood}
                    onChange={handleEventInputChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="remadeItems">Re-made Items</Label>
                  <Input
                    type="text"
                    id="remadeItems"
                    name="remadeItems"
                    value={eventForm.remadeItems}
                    onChange={handleEventInputChange}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={eventForm.notes}
                  onChange={handleEventInputChange}
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEventForm({
                      date: new Date().toISOString().split('T')[0],
                      eventName: '',
                      pujyaSanto: '',
                      totalBhaktas: 0,
                      gents: 0,
                      ladies: 0,
                      menu: '',
                      ingredients: '',
                      peopleCount: 0,
                      leftoverFood: '',
                      remadeItems: '',
                      notes: ''
                    });
                    setEditingId(null);
                  }}
                >
                  Reset
                </Button>
                <Button type="submit">
                  {editingId ? 'Update Event' : 'Add Event'}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Sabha Events</h2>
            
            {filteredEvents.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>No Events Found</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>No events have been added yet. Add your first event using the "Add Event" tab.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredEvents.map(event => (
                  <Card key={event.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{event.eventName}</CardTitle>
                          <CardDescription>
                            {new Date(event.date).toLocaleDateString()} • {event.pujyaSanto || 'No Pujya Santo'}
                          </CardDescription>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editEvent(event.id)}
                            className="text-indigo-600 dark:text-indigo-400"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteEvent(event.id)}
                            className="text-red-600 dark:text-red-400"
                          >
                            <Trash className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="font-semibold">Attendance</p>
                          <p>Total: {event.totalBhaktas}</p>
                          <p>Gents: {event.gents}</p>
                          <p>Ladies: {event.ladies}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Menu</p>
                          <p>{event.menu || 'No menu items'}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Notes</p>
                          <p>{event.notes || 'No notes'}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 h-8">
                        <div className="flex h-full rounded overflow-hidden">
                          <div
                            className="bg-indigo-500"
                            style={{ width: `${(event.gents / event.totalBhaktas) * 100}%` }}
                            title={`Gents: ${event.gents}`}
                          ></div>
                          <div
                            className="bg-pink-500"
                            style={{ width: `${(event.ladies / event.totalBhaktas) * 100}%` }}
                            title={`Ladies: ${event.ladies}`}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs mt-1">
                          <span>Gents: {event.gents}</span>
                          <span>Ladies: {event.ladies}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Recipes Tab */}
        {activeTab === 'recipes' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Recipe Book</h2>
              <Button
                onClick={() => {
                  setActiveTab('recipes');
                  setRecipeForm({
                    name: '',
                    ingredients: '',
                    process: '',
                    category: 'Main Course'
                  });
                  setEditingId(null);
                  setShowRecipeForm(true);
                }}
                variant="outline"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Recipe
              </Button>
            </div>
            
            {showRecipeForm ? (
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-6">
                  {editingId ? 'Edit Recipe' : 'Add New Recipe'}
                </h2>
                
                <form onSubmit={handleSubmitRecipe} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <Label htmlFor="name">Recipe Name</Label>
                      <Input
                        type="text"
                        id="name"
                        name="name"
                        value={recipeForm.name}
                        onChange={handleRecipeInputChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <select
                        id="category"
                        name="category"
                        value={recipeForm.category}
                        onChange={(e) => setRecipeForm({...recipeForm, category: e.target.value})}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="Main Course">Main Course</option>
                        <option value="Side Dish">Side Dish</option>
                        <option value="Dessert">Dessert</option>
                        <option value="Snack">Snack</option>
                        <option value="Drink">Drink</option>
                      </select>
                    </div>
                    
                    <div>
                      <Label htmlFor="ingredients">Ingredients (one per line)</Label>
                      <Textarea
                        id="ingredients"
                        name="ingredients"
                        value={recipeForm.ingredients}
                        onChange={handleRecipeInputChange}
                        rows={5}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="process">Cooking Process</Label>
                      <Textarea
                        id="process"
                        name="process"
                        value={recipeForm.process}
                        onChange={handleRecipeInputChange}
                        rows={8}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowRecipeForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingId ? 'Update Recipe' : 'Add Recipe'}
                    </Button>
                  </div>
                </form>
              </div>
            ) : filteredRecipes.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>No Recipes Found</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>No recipes have been added yet. Add your first recipe using the "Add Recipe" button.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecipes.map(recipe => (
                  <Card key={recipe.id} className="h-full flex flex-col">
                    <CardHeader>
                      <CardTitle>{recipe.name}</CardTitle>
                      <CardDescription>{recipe.category}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="mb-4">
                        <p className="font-semibold">Ingredients</p>
                        <p className="whitespace-pre-line">
                          {recipe.ingredients.split('\n').slice(0, 3).join('\n')}
                          {recipe.ingredients.split('\n').length > 3 && '...'}
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editRecipe(recipe.id)}
                        className="text-indigo-600 dark:text-indigo-400"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteRecipe(recipe.id)}
                        className="text-red-600 dark:text-red-400"
                      >
                        <Trash className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Floating Export Button */}
      <button
        onClick={exportData}
        className="fixed bottom-6 right-6 bg-indigo-600 text-white p-2 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
      >
        <Download className="w-5 h-5" />
      </button>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-md shadow-lg ${
          toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
