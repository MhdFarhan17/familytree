"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import {
  Moon,
  Sun,
  Languages,
  Search,
  Menu,
  X,
  LogOut,
  LogIn,
  User as UserIcon,
} from "lucide-react";
import { useFamily } from "@/context/FamilyContext";
import { FamilyMember } from "@/types";
import DetailModal from "./DetailModal";
import ConfirmModal from "./ConfirmModal";
import toast from "react-hot-toast";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { user, login, logout } = useAuth();
  const { members } = useFamily();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginMenuOpen, setIsLoginMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(
    null,
  );

  const searchResults =
    searchQuery.trim() === ""
      ? []
      : members
          .filter(
            (m) =>
              m.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              m.nickname.toLowerCase().includes(searchQuery.toLowerCase()),
          )
          .slice(0, 5); // Limit to 5 results

  const handleLogout = () => {
    logout();
    toast.success(t("logoutSuccess") || "Logged out successfully");
    setIsLogoutModalOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="bg-background/90 backdrop-blur-md border-b border-border shadow-sm sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo & Links */}
            <div className="flex items-center">
              <Link
                href="/"
                className="text-2xl font-bold text-primary mr-8 truncate max-w-[150px] sm:max-w-xs"
              >
                {t("appTitle")}
              </Link>
              <div className="hidden lg:flex space-x-6">
                <Link
                  href="/"
                  className="text-foreground hover:text-primary transition-colors font-medium"
                >
                  {t("home")}
                </Link>
                <Link
                  href="/members"
                  className="text-foreground hover:text-primary transition-colors font-medium"
                >
                  {t("membersList")}
                </Link>
                {!user && (
                  <Link
                    href="/about"
                    className="text-foreground hover:text-primary transition-colors font-medium"
                  >
                    {t("about")}
                  </Link>
                )}
                {user && (
                  <Link
                    href="/admin"
                    className="text-foreground hover:text-primary transition-colors font-medium"
                  >
                    {user.role === "admin" ? t("admin") : "Dashboard"}
                  </Link>
                )}
              </div>
            </div>

            {/* Desktop Right Side */}
            <div className="hidden lg:flex items-center space-x-4">
              <div className="relative z-50">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-48 xl:w-64 pl-10 pr-3 py-2 border border-border rounded-md leading-5 bg-background placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder={t("searchFamily")}
                />

                {/* Search Dropdown */}
                {searchQuery && (
                  <div className="absolute top-full mt-2 w-full bg-card border border-border rounded-xl shadow-xl overflow-hidden flex flex-col">
                    {searchResults.length > 0 ? (
                      searchResults.map((member) => (
                        <div
                          key={member.id}
                          onClick={() => {
                            setSelectedMember(member);
                            setSearchQuery("");
                          }}
                          className="flex items-center p-3 hover:bg-muted cursor-pointer transition-colors border-b border-border last:border-b-0"
                        >
                          {member.photo_url ? (
                            <img
                              src={member.photo_url}
                              alt={member.nickname}
                              className="w-8 h-8 rounded-full border border-muted mr-3 object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full border border-muted bg-muted mr-3 flex items-center justify-center text-muted-foreground flex-shrink-0">
                              <UserIcon className="w-4 h-4 opacity-50" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-foreground truncate">
                              {member.full_name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {member.nickname}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        {t("notFound")}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="relative flex items-center group">
                <Languages className="h-5 w-5 text-muted-foreground absolute left-2 pointer-events-none" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as "en" | "id")}
                  className="appearance-none bg-transparent hover:bg-muted text-foreground py-2 pl-9 pr-8 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary transition-colors font-medium text-sm border border-transparent hover:border-border"
                  aria-label="Select Language"
                >
                  <option value="en" className="bg-background text-foreground">
                    English
                  </option>
                  <option value="id" className="bg-background text-foreground">
                    Bahasa Indonesia
                  </option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>

              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-muted text-foreground transition-colors"
                aria-label="Toggle Theme"
              >
                {theme === "light" ? (
                  <Moon className="h-6 w-6" />
                ) : (
                  <Sun className="h-6 w-6" />
                )}
                <span className="sr-only">Toggle Theme</span>
              </button>

              {/* Auth Button */}
              <div className="relative ml-2">
                {user ? (
                  <button
                    onClick={() => setIsLogoutModalOpen(true)}
                    className="flex items-center space-x-2 bg-red-600 text-white hover:bg-red-700 hover:scale-105 active:scale-95 px-4 py-2 rounded-md transition-all text-sm font-semibold shadow-md"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>{t("logout")}</span>
                  </button>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="flex items-center space-x-2 bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 active:scale-95 px-4 py-2 rounded-md transition-all text-sm font-semibold shadow-md"
                    >
                      <LogIn className="h-4 w-4" />
                      <span>{t("login")}</span>
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Mobile/Tablet menu button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-foreground hover:bg-muted focus:outline-none"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-card border-b border-border">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                href="/"
                className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted"
              >
                {t("home")}
              </Link>
              <Link
                href="/members"
                className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted"
              >
                {t("membersList")}
              </Link>
              {!user && (
                <Link
                  href="/about"
                  className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted"
                >
                  {t("about")}
                </Link>
              )}
              {user && (
                <Link
                  href="/admin"
                  className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted"
                >
                  {user.role === "admin" ? t("admin") : "Dashboard"}
                </Link>
              )}
            </div>

            <div className="pt-4 pb-4 border-t border-border px-4 space-y-4">
              {/* Auth Section */}
              <div className="flex flex-col space-y-2">
                {user ? (
                  <button
                    onClick={() => setIsLogoutModalOpen(true)}
                    className="w-full flex items-center justify-center bg-red-600 text-white hover:bg-red-700 hover:scale-105 active:scale-95 px-4 py-2 rounded-md transition-all text-sm font-semibold shadow-md"
                  >
                    <LogOut className="h-4 w-4 mr-2" /> {t("logout")} (
                    {user.role})
                  </button>
                ) : (
                  <div className="grid grid-cols-1 gap-2">
                    <p className="text-sm text-muted-foreground mb-1 font-semibold">
                      {t("joinFamily")}
                    </p>
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 active:scale-95 px-4 py-2 rounded-md transition-all text-sm font-semibold shadow-md"
                    >
                      <LogIn className="h-4 w-4 mr-2" /> {t("login")}
                    </Link>
                  </div>
                )}
              </div>

              <div className="border-t border-border pt-4 flex justify-between items-center">
                <div className="flex flex-col flex-1">
                  <label className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">
                    {t("languageSelector")}
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as "en" | "id")}
                    className="bg-muted text-foreground p-2 rounded focus:outline-none text-sm cursor-pointer border border-transparent hover:border-border"
                  >
                    <option
                      value="en"
                      className="bg-background text-foreground"
                    >
                      English
                    </option>
                    <option
                      value="id"
                      className="bg-background text-foreground"
                    >
                      Bahasa Indonesia
                    </option>
                  </select>
                </div>

                <div className="flex flex-col flex-1 items-end">
                  <label className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">
                    {t("themeMenu")}
                  </label>
                  <button
                    onClick={toggleTheme}
                    className="flex items-center text-foreground p-2 rounded hover:bg-muted border border-transparent hover:border-border w-full justify-center"
                  >
                    {theme === "light" ? (
                      <Moon className="h-5 w-5 mr-2" />
                    ) : (
                      <Sun className="h-5 w-5 mr-2" />
                    )}
                    <span className="text-sm">
                      {theme === "light" ? t("dark") : t("light")}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Global Detail Modal */}
      <DetailModal
        member={selectedMember}
        isOpen={selectedMember !== null}
        onClose={() => setSelectedMember(null)}
      />

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={isLogoutModalOpen}
        title={t("logoutConfirmTitle")}
        message={t("logoutConfirmMsg")}
        confirmText={t("logout")}
        onConfirm={handleLogout}
        onCancel={() => setIsLogoutModalOpen(false)}
      />
    </>
  );
}
